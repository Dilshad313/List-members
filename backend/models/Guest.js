const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['individual', 'family'],
    required: true,
    default: 'individual'
  },
  nameMalayalam: { type: String, trim: true, default: '' },
  nameEnglish: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  relation: { type: String, trim: true, default: '' },
  invited: {
    type: String,
    enum: ['വിളിച്ചു', 'വിളിച്ചിട്ടില്ല'],
    default: 'വിളിച്ചു'
  },
  attendance: {
    type: String,
    enum: ['വരും', 'വരില്ല', 'സംശയം'],
    default: 'വരും'
  },
  notes: { type: String, trim: true, default: '' },
  count: { type: Number, default: 1, min: 1 },
  createdAt: { type: Date, default: Date.now }
});

guestSchema.pre('validate', function (next) {
  if (!this.nameMalayalam?.trim() && !this.nameEnglish?.trim()) {
    this.invalidate('nameMalayalam', 'At least one of nameMalayalam or nameEnglish is required');
  }
  if (this.type !== 'family') {
    this.count = 1;
  }
  next();
});

module.exports = mongoose.model('Guest', guestSchema);
