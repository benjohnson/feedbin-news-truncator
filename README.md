# Feedbin News Truncator
I subscribe to a bunch of news RSS feeds with [Feedbin](https://feedbin.com). I like this. It tells me what’s going on in the world. But… if I don’t get a chance to check Feedbin for a few days, something terrible happens: *the news is old*.

Old. News.  
Like we’re back in the days of paper newspapers.  
The *Horror*.  

This thing runs as a Kubernetes cron job and truncates all RSS feeds in my Feedbin “News” tag so that the news is never more than two days old.

---

A few notes:

* You can do whatever you want with this code. It’s code. If you run it, and something terrible happens… sorry. I can at least promise it doesn’t have a Bitcoin miner (though given the state of NPM modules, maybe I shouldn’t make that promise).
* It needs a .env file in the root with your Feedbin username/password or env variables set. See the .env.test file for an example.
* Thanks to Feedbin for having an [awesome API](https://github.com/feedbin/feedbin-api).
