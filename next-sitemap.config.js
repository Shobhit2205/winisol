/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://winisol.com",
    generateRobotsTxt: true,
    exclude: ["/authority/*"], 
    changefreq: "weekly",
    priority: 0.7,
};