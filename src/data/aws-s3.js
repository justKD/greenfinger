import * as AWS from "aws-sdk";

// AWS.config.update({
//   region: "us-west-2",
//   credentials: new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: "us-east-2:704cb170-2613-4e27-ade1-cb33b76378d4",
//   }),
// });

AWS.config.region = "us-east-2"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-2:704cb170-2613-4e27-ade1-cb33b76378d4",
});
var identityId = AWS.config.credentials.identityId;
console.log(identityId);

// // Make the call to obtain credentials
// AWS.config.credentials.get(function(){

//   // Credentials will be available when this function is called.
//   var accessKeyId = AWS.config.credentials.accessKeyId;
//   var secretAccessKey = AWS.config.credentials.secretAccessKey;
//   var sessionToken = AWS.config.credentials.sessionToken;

//   console.log(accessKeyId, secretAccessKey, sessionToken)

// });

// // Create S3 service object
// const s3 = new AWS.S3({
//   apiVersion: "2006-03-01",
// });

// // Call S3 to list the buckets
// s3.listBuckets(function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Buckets);
//   }
// });
