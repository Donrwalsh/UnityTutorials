const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a store name!'
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	tags: [String],
	created: {
		type: Date,
		default: Date.now
	},
	location: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [{
			type: Number,
			required: 'You must supply coordinates!'
		}],
		address: {
			type: String,
			required: 'You must supply an address!'
		}
	},
	photo: String,
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author'
	}
}, {
	toJson: { virtuals: true },
	toObject: { virtuals: true },
});

// Define our index
storeSchema.index({
	name: 'text',
	description: 'text'
});

storeSchema.index({ location: '2dsphere' });

//Note, this block below is not updating slugs.
storeSchema.pre('save', async function(next) {
	if (!this.isModified('name')) {
		next(); // skip it
		return; // stop this function from running if the name didn't change
	}
	this.slug = slug(this.name);
	// find other stores that have a slug of store, store-1, store-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
	if(storesWithSlug.length) {
		this.slug = `${this.slug}-${storesWithSlug.length +1 }`;
	}
	next();
});

storeSchema.statics.getTagsList = function() {
	return this.aggregate([
		{ $unwind: '$tags' },
		{ $group: { _id: '$tags', count: { $sum: 1 } }},
		{ $sort: { count: -1}}
		]);
		
};

storeSchema.virtual('reviews', {
	ref: 'Review', // what model to link?
	localField: '_id', // which field on the Store?
	foreignField: 'store' // which field on the Review?
});

module.exports = mongoose.model('Store', storeSchema);