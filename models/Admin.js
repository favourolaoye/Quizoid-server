import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  adminID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
},
{
   timestamps: true
});

export default mongoose.model('Admin', AdminSchema);
