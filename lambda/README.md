This lambda function is called whenever a new entry is added to the S3 bucket constellational-store. It is pretty much just server side React rendering to html, but instead of sending this to the browser (as one would usually do) it saves it to an S3 bucket. Users then access this file.