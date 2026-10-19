import AdminQuery from '../models/AdminQuery.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';

// In-memory sliding rate limiter: max 15 submissions per 15 minutes per IP
const queryRateLimits = new Map();

function checkQueryRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 15;

  const record = queryRateLimits.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }
  queryRateLimits.set(ip, record);
  return record.count <= maxRequests;
}

// 1. Submit Query (Public Endpoint with input sanitization and rate limiting)
export async function submitQuery(req, res) {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (!checkQueryRateLimit(clientIp)) {
      return res.status(429).json({
        error: 'Too many queries submitted from this network. Please wait a few minutes before submitting again.',
      });
    }

    const { name, email, phone, role, category, subject, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Sender name is required' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const queryId = `QRY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newQueryData = {
      id: queryId,
      name: name.trim().slice(0, 120),
      email: email.trim().toLowerCase().slice(0, 150),
      phone: (phone || '').toString().trim().slice(0, 25),
      role: (role || 'farmer').toString().trim().slice(0, 30),
      category: category || 'General Inquiry',
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 3000),
      status: 'Pending',
      adminNotes: '',
      ipAddress: clientIp.toString().slice(0, 45),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to MongoDB Atlas
    if (isDbConnected()) {
      try {
        const mongoQuery = new AdminQuery(newQueryData);
        await mongoQuery.save();
      } catch (dbErr) {
        console.warn('MongoDB query save note:', dbErr.message);
      }
    }

    // Also push to in-memory store
    if (!store.queries) store.queries = [];
    store.queries.unshift(newQueryData);

    return res.status(201).json({
      success: true,
      message: 'Your query has been submitted successfully to the KisanSetu administration. Our support team will review it shortly.',
      queryId: newQueryData.id,
      query: {
        id: newQueryData.id,
        name: newQueryData.name,
        subject: newQueryData.subject,
        category: newQueryData.category,
        status: newQueryData.status,
        createdAt: newQueryData.createdAt,
      },
    });
  } catch (error) {
    console.error('Submit query error:', error.message);
    return res.status(500).json({ error: 'An unexpected error occurred while submitting your query. Please try again.' });
  }
}

// 2. Get All Queries (Admin Only)
export async function getAllQueries(req, res) {
  try {
    const { status, category, search } = req.query;

    if (isDbConnected()) {
      try {
        const filter = {};
        if (status && status !== 'All') filter.status = status;
        if (category && category !== 'All') filter.category = category;
        if (search && typeof search === 'string' && search.trim()) {
          const safeSearch = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          filter.$or = [
            { id: new RegExp(safeSearch, 'i') },
            { name: new RegExp(safeSearch, 'i') },
            { email: new RegExp(safeSearch, 'i') },
            { phone: new RegExp(safeSearch, 'i') },
            { subject: new RegExp(safeSearch, 'i') },
            { message: new RegExp(safeSearch, 'i') },
          ];
        }

        const queries = await AdminQuery.find(filter).sort({ createdAt: -1 });
        if (queries && queries.length > 0) {
          return res.json(queries);
        }
      } catch (dbErr) {
        console.warn('DB query fetch note:', dbErr.message);
      }
    }

    let list = store.queries || [];
    if (status && status !== 'All') list = list.filter((q) => q.status === status);
    if (category && category !== 'All') list = list.filter((q) => q.category === category);
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.id?.toLowerCase().includes(q) ||
          item.name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.subject?.toLowerCase().includes(q) ||
          item.message?.toLowerCase().includes(q)
      );
    }

    return res.json(list);
  } catch (error) {
    console.error('Get queries error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve queries' });
  }
}

// 3. Get Query By ID (Admin Only)
export async function getQueryById(req, res) {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const query = await AdminQuery.findOne({ id });
        if (query) return res.json(query);
      } catch (dbErr) {
        // Fallback
      }
    }

    const query = (store.queries || []).find((q) => q.id === id);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    return res.json(query);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve query details' });
  }
}

// 4. Update Query Status and Notes (Admin Only)
export async function updateQueryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updateFields = {
      updatedAt: new Date().toISOString(),
    };
    if (status) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes.toString().trim().slice(0, 2000);
    if (status === 'Resolved' || status === 'Closed') {
      updateFields.resolvedAt = new Date();
    }

    let updatedDoc = null;

    if (isDbConnected()) {
      try {
        updatedDoc = await AdminQuery.findOneAndUpdate({ id }, { $set: updateFields }, { new: true });
      } catch (dbErr) {
        console.warn('DB update query note:', dbErr.message);
      }
    }

    if (store.queries) {
      const idx = store.queries.findIndex((q) => q.id === id);
      if (idx !== -1) {
        store.queries[idx] = { ...store.queries[idx], ...updateFields };
        if (!updatedDoc) updatedDoc = store.queries[idx];
      }
    }

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Query not found to update' });
    }

    return res.json({
      success: true,
      message: 'Query updated successfully',
      query: updatedDoc,
    });
  } catch (error) {
    console.error('Update query error:', error.message);
    return res.status(500).json({ error: 'Failed to update query status' });
  }
}

// 5. Delete Query (Admin Only)
export async function deleteQuery(req, res) {
  try {
    const { id } = req.params;

    let deleted = false;
    if (isDbConnected()) {
      try {
        const result = await AdminQuery.deleteOne({ id });
        deleted = result.deletedCount > 0;
      } catch (dbErr) {
        console.warn('DB delete query note:', dbErr.message);
      }
    }

    if (store.queries) {
      const initialLen = store.queries.length;
      store.queries = store.queries.filter((q) => q.id !== id);
      if (store.queries.length < initialLen) deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Query not found or already deleted' });
    }

    return res.json({ success: true, message: 'Query record deleted successfully' });
  } catch (error) {
    console.error('Delete query error:', error.message);
    return res.status(500).json({ error: 'Failed to delete query record' });
  }
}
