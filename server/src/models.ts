import mongoose, { Schema } from 'mongoose';

const mysterySchema = new Schema({ title: { type: String, required: true }, scenario: { type: String, required: true }, genre: String, difficulty: String, tone: String, language: String, suspectCount: Number, requestedEvidenceTypes: [String], summary: String, status: { type: String, default: 'pending', index: true }, generationError: { code: String, message: String } }, { timestamps: true });
const suspectSchema = new Schema({ mysteryId: { type: Schema.Types.ObjectId, required: true, index: true }, suspectKey: String, name: String, age: Number, occupation: String, relationshipToIncident: String, background: String, publicMotive: String, alibi: String }, { timestamps: true });
const evidenceSchema = new Schema({ mysteryId: { type: Schema.Types.ObjectId, required: true, index: true }, evidenceKey: String, title: String, type: String, description: String, content: Schema.Types.Mixed, occurredAt: String, location: String, relatedSuspectKeys: [String], relatedEvidenceKeys: [String], clueKeys: [String] }, { timestamps: true });
const solutionSchema = new Schema({ mysteryId: { type: Schema.Types.ObjectId, required: true, unique: true }, culpritSuspectKey: String, motive: String, method: String, opportunity: String, incidentSummary: String, timeline: [Schema.Types.Mixed], deductions: [Schema.Types.Mixed], redHerringExplanations: [Schema.Types.Mixed], fullReveal: String }, { timestamps: true });
const accusationSchema = new Schema({ mysteryId: { type: Schema.Types.ObjectId, required: true, index: true }, sessionId: { type: String, required: true }, selectedSuspectKey: String, isCorrect: Boolean, submittedAt: { type: Date, default: Date.now } }, { timestamps: true });
accusationSchema.index({ mysteryId: 1, sessionId: 1 }, { unique: true });
export const Mystery = mongoose.model('Mystery', mysterySchema);
export const Suspect = mongoose.model('Suspect', suspectSchema);
export const Evidence = mongoose.model('Evidence', evidenceSchema);
export const Solution = mongoose.model('MysterySolution', solutionSchema);
export const Accusation = mongoose.model('Accusation', accusationSchema);
