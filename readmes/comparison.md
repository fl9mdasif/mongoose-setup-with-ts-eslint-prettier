# comparisons

### findOne vs findById

### findOneAndUpdate vs findByIdAndUpdate

- we use findOne, when we use our custom `id`
- we use findById, when we use mongoose `_id`
- anything includes `ById` means use mongoose `_id`

Model.deleteMany()
Model.deleteOne()
Model.find()

### id method

Model.findById()
Model.findByIdAndDelete()
Model.findByIdAndRemove()
Model.findByIdAndUpdate()

### normal custom field search with custom id or others field

Model.findOne()
Model.findOneAndDelete()
Model.findOneAndReplace()
Model.findOneAndUpdate()

Model.replaceOne()
Model.updateMany()
Model.updateOne()
