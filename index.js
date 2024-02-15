const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

const replaceTemplates = require("./modules/replaceTemplate.js");

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` , "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` , "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` , "utf-8");


const data = fs.readFileSync(`${__dirname}/dev-data/data.json` , "utf-8");
const dataObj = JSON.parse(data);


const slugs = dataObj.map(el => slugify(el.productName , {lower:true}));
console.log(slugs);

const server = http.createServer((req,res)=>{

    const {query,pathname} = url.parse(req.url, true);

    /// این برای صفحه product
    if (pathname === "/product") {
        res.writeHead(200 , {"Content-type" : "text/html"});
        const product = dataObj[query.id];
        const output = replaceTemplates(tempProduct,product);
        res.end(output);

        ///این برای صفحه overview
    } else if (pathname === "/overview" || pathname === "/") {
        res.writeHead(200 , {"Content-type" : "text/html"});

        
        const cardHtml = dataObj.map(el => replaceTemplates(tempCard,el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}" , cardHtml);
        res.end(output);

        ///این برای صفحه API
    }else if (pathname === "/api"){
           res.writeHead(200 , {"Content-type" : "application/json"});
           res.end(data);
        
       
        //این برای اررور404
    }else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>Page not found!</h1>");
    }
});
 
 server.listen(8000,"127.0.0.1", ()=>{
    console.log("listening on port 8000");
 });


 