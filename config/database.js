if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://kenimitesh:kenimitesh@ds263639.mlab.com:63639/ideasappprod'
    }
}
else {
    module.exports = {
        mongoURI: 'mongodb://localhost/ideas-app-dev'
    }
}
