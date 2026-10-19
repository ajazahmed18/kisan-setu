import Vegetable from '../models/Vegetable.js';
import PriceHistory from '../models/PriceHistory.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';

function escapeRegex(text) {
  return typeof text === 'string' ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : '';
}

export async function getVegetables(req, res) {
  try {
    const { search, category, market, grade, status, sortBy } = req.query;

    let items = [];
    if (isDbConnected()) {
      try {
        const filter = { isDeleted: { $ne: true } };
        if (category && category !== 'All') filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
        if (market && market !== 'All') filter.market = new RegExp(escapeRegex(market), 'i');
        if (grade && grade !== 'All') filter.grade = grade;
        if (status && status !== 'All') filter.status = status;
        if (search) {
          const safeSearch = escapeRegex(search);
          filter.$or = [
            { name: new RegExp(safeSearch, 'i') },
            { nameHi: new RegExp(safeSearch, 'i') },
            { nameTe: new RegExp(safeSearch, 'i') },
            { category: new RegExp(safeSearch, 'i') },
            { market: new RegExp(safeSearch, 'i') },
          ];
        }

        let sortOption = { updatedAt: -1 };
        if (sortBy === 'price_asc') sortOption = { currentPrice: 1 };
        else if (sortBy === 'price_desc') sortOption = { currentPrice: -1 };
        else if (sortBy === 'volume') sortOption = { arrivalVolume: -1 };
        else if (sortBy === 'name') sortOption = { name: 1 };

        items = await Vegetable.find(filter).sort(sortOption);
        if (items && items.length > 0) {
          return res.json(items);
        }
      } catch (e) {
        // Fall through to memory store
      }
    }

    // Resilient store query
    let list = [...store.vegetables].filter((v) => !v.isDeleted);
    if (category && category !== 'All') {
      list = list.filter((v) => v.category?.toLowerCase() === category.toLowerCase());
    }
    if (market && market !== 'All') {
      list = list.filter((v) => v.market?.toLowerCase().includes(market.toLowerCase()));
    }
    if (grade && grade !== 'All') {
      list = list.filter((v) => (v.grade || 'Grade A') === grade);
    }
    if (status && status !== 'All') {
      list = list.filter((v) => (v.status || 'Active') === status);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.nameHi && v.nameHi.toLowerCase().includes(q)) ||
          (v.nameTe && v.nameTe.toLowerCase().includes(q)) ||
          v.category?.toLowerCase().includes(q) ||
          v.market?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') list.sort((a, b) => a.currentPrice - b.currentPrice);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.currentPrice - a.currentPrice);
    else if (sortBy === 'volume') list.sort((a, b) => (b.arrivalVolume || 0) - (a.arrivalVolume || 0));
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    res.json(list);
  } catch (error) {
    console.error('Error fetching vegetables:', error);
    res.status(500).json({ error: 'Failed to fetch vegetables' });
  }
}

export async function getVegetableById(req, res) {
  try {
    if (isDbConnected()) {
      try {
        const item = await Vegetable.findOne({ id: req.params.id, isDeleted: { $ne: true } });
        if (item) return res.json(item);
      } catch (e) {
        // Fallback
      }
    }

    const found = store.vegetables.find((v) => v.id === req.params.id && !v.isDeleted);
    if (!found) return res.status(404).json({ error: 'Vegetable not found' });
    res.json(found);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vegetable' });
  }
}

export async function createVegetable(req, res) {
  try {
    const {
      name,
      nameHi,
      nameTe,
      category,
      unit,
      currentPrice,
      minPrice,
      maxPrice,
      market,
      location,
      image,
      description,
      priceDate,
      arrivalVolume,
      grade,
      status,
      adminName,
    } = req.body;

    if (!name || !currentPrice) {
      return res.status(400).json({ error: 'Vegetable name and current price are required' });
    }

    const priceNum = parseFloat(currentPrice);
    const mPrice = parseFloat(minPrice) || Math.round(priceNum * 0.85);
    const mxPrice = parseFloat(maxPrice) || Math.round(priceNum * 1.15);
    const now = new Date().toISOString();
    const vegId = `veg-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}-${Date.now().toString().slice(-4)}`;

    const newVeg = {
      id: vegId,
      name: name.trim(),
      nameHi: nameHi?.trim() || '',
      nameTe: nameTe?.trim() || '',
      category: category || 'Fruit Vegetable',
      unit: unit || 'kg',
      currentPrice: priceNum,
      previousPrice: priceNum,
      minPrice: mPrice,
      maxPrice: mxPrice,
      market: market || 'Warangal APMC Enamamula Market',
      location: location || 'Warangal, Telangana',
      image: image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
      description: description || 'Fresh market arrival recorded by Market Admin',
      priceDate: priceDate || now.split('T')[0],
      arrivalVolume: arrivalVolume ? Number(arrivalVolume) : 350,
      grade: grade || 'Grade A',
      status: status || 'Active',
      createdAt: now,
      updatedAt: now,
    };

    store.vegetables.unshift(newVeg);

    const historyItem = {
      id: `vph-${Date.now()}`,
      vegetableId: newVeg.id,
      vegetableName: newVeg.name,
      oldPrice: 0,
      newPrice: newVeg.currentPrice,
      oldMinPrice: 0,
      newMinPrice: newVeg.minPrice,
      oldMaxPrice: 0,
      newMaxPrice: newVeg.maxPrice,
      arrivalVolume: newVeg.arrivalVolume,
      market: newVeg.market,
      changedBy: adminName || req.user?.name || 'Market Admin',
      role: req.user?.role || 'market_admin',
      notes: 'Initial commodity listing registered in APMC bulletin.',
      timestamp: now,
    };
    store.priceHistory.unshift(historyItem);

    if (isDbConnected()) {
      try {
        await new Vegetable(newVeg).save();
        await new PriceHistory(historyItem).save();
      } catch (err) {
        console.warn('MongoDB save notice:', err.message);
      }
    }

    res.status(201).json(newVeg);
  } catch (error) {
    console.error('Error creating vegetable:', error);
    res.status(500).json({ error: error.message || 'Failed to add vegetable' });
  }
}

export async function updateVegetable(req, res) {
  try {
    const { id } = req.params;
    const existing = store.vegetables.find((v) => v.id === id);
    if (!existing) return res.status(404).json({ error: 'Vegetable not found' });

    const oldPrice = existing.currentPrice;
    const oldMinPrice = existing.minPrice;
    const oldMaxPrice = existing.maxPrice;
    const updates = req.body;

    const newCurrentPrice = updates.currentPrice !== undefined ? parseFloat(updates.currentPrice) : existing.currentPrice;
    const newMinPrice = updates.minPrice !== undefined ? parseFloat(updates.minPrice) : existing.minPrice;
    const newMaxPrice = updates.maxPrice !== undefined ? parseFloat(updates.maxPrice) : existing.maxPrice;

    existing.previousPrice = oldPrice;
    existing.currentPrice = newCurrentPrice;
    existing.minPrice = newMinPrice;
    existing.maxPrice = newMaxPrice;

    if (updates.name) existing.name = updates.name.trim();
    if (updates.nameHi !== undefined) existing.nameHi = updates.nameHi;
    if (updates.nameTe !== undefined) existing.nameTe = updates.nameTe;
    if (updates.category) existing.category = updates.category;
    if (updates.unit) existing.unit = updates.unit;
    if (updates.market) existing.market = updates.market;
    if (updates.location) existing.location = updates.location;
    if (updates.image) existing.image = updates.image;
    if (updates.description) existing.description = updates.description;
    if (updates.priceDate) existing.priceDate = updates.priceDate;
    if (updates.arrivalVolume !== undefined) existing.arrivalVolume = Number(updates.arrivalVolume);
    if (updates.grade) existing.grade = updates.grade;
    if (updates.status) existing.status = updates.status;
    existing.updatedAt = new Date().toISOString();

    if (oldPrice !== newCurrentPrice || updates.notes || updates.arrivalVolume !== undefined) {
      const historyItem = {
        id: `vph-${Date.now()}`,
        vegetableId: existing.id,
        vegetableName: existing.name,
        oldPrice,
        newPrice: newCurrentPrice,
        oldMinPrice,
        newMinPrice,
        oldMaxPrice,
        newMaxPrice,
        arrivalVolume: existing.arrivalVolume,
        market: existing.market,
        changedBy: updates.changedBy || req.user?.name || 'Market Admin',
        role: req.user?.role || 'market_admin',
        notes: updates.notes || `Price updated from ₹${oldPrice} to ₹${newCurrentPrice}/${existing.unit}.`,
        timestamp: new Date().toISOString(),
      };
      store.priceHistory.unshift(historyItem);

      if (isDbConnected()) {
        try {
          await new PriceHistory(historyItem).save();
        } catch (e) {
          // non-blocking
        }
      }
    }

    if (isDbConnected()) {
      try {
        await Vegetable.updateOne({ id }, { $set: existing });
      } catch (e) {
        // non-blocking
      }
    }

    res.json(existing);
  } catch (error) {
    console.error('Error updating vegetable:', error);
    res.status(500).json({ error: error.message || 'Failed to update vegetable' });
  }
}

export async function deleteVegetable(req, res) {
  try {
    const { id } = req.params;
    const existing = store.vegetables.find((v) => v.id === id);
    if (existing) {
      existing.isDeleted = true;
      existing.status = 'Archived';
    }

    if (isDbConnected()) {
      try {
        await Vegetable.updateOne({ id }, { $set: { isDeleted: true, status: 'Archived' } });
      } catch (e) {
        // non-blocking
      }
    }

    res.json({ success: true, message: 'Vegetable archived successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vegetable' });
  }
}

export async function getPriceHistory(req, res) {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      try {
        const filter = id ? { vegetableId: id } : {};
        const history = await PriceHistory.find(filter).sort({ timestamp: -1 }).limit(100);
        if (history && history.length > 0) return res.json(history);
      } catch (e) {
        // fall through
      }
    }

    const matches = id
      ? store.priceHistory.filter((h) => h.vegetableId === id)
      : store.priceHistory;
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
}
