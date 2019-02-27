const AWS = require('aws-sdk');
const moment = require('moment');
var rds = new AWS.RDS({
  region: 'ap-northeast-1'
});
end = moment(process.argv[2]);

const abbreviate = (model) => {
  switch(model) {
    case 'bring-your-own-license':
      return '(byol)';
      break;
    case 'license-included':
      return '(li)';
      break;
    default:
      return '';
  }
}
rds.describeDBInstances().promise().then((res)=>{
  let instances = res.DBInstances.reduce((pre,cur)=>{let key = `${cur.DBInstanceClass},${cur.Engine}${abbreviate(cur.LicenseModel)},${cur.MultiAZ}`;if(key in pre){pre[key]++}else{pre[key]=1};return pre},{});
  rds.describeReservedDBInstances().promise().then((res)=>{
    console.log(res.ReservedDBInstances.filter(item=>moment(item.StartTime).add(item.Duration,'seconds')>end).reduce((pre,cur)=>{let key = `${cur.DBInstanceClass},${cur.ProductDescription},${cur.MultiAZ}`;if(key in pre){pre[key]-=cur.DBInstanceCount}else{pre[key]=-cur.DBInstanceCount};return pre},instances));
  });
}).catch(error=>{
  console.log(error);
});
