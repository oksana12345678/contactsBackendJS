import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    user: { name: { type: String }, email: { type: String } },

    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SessionCollection = model('sessions', sessionSchema);

export default SessionCollection;
