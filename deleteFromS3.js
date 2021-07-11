const AWS = require('aws-sdk');

const BUCKET_NAME = 'marzouk-test';
const IAM_USER_KEY = 'AKIAQQU4RPWA6FTP5H7O';
const IAM_USER_SECRET = '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';


function deleteFromS3(path) {
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });
    const params = {
        Bucket: BUCKET_NAME,
        Key: path
    }
    s3bucket.deleteObject(params, function (err) {
        if (err) {
          console.log('error in callback');
          console.log(err);
          return
        }
        console.log('success');
    })
}
deleteFromS3('uploads')
