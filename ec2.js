const AWS = require('aws-sdk');
const moment = require('moment');

console.log(process.argv);

end = moment(process.argv[2]);

var ec2 = new AWS.EC2({
  region: 'ap-northeast-1'
});
const linuxType = (desc,instanceId)=>{
  if(!desc){
    return 'Linux/UNIX';
  } else if(desc.match(/RHEL/)) {
    return 'red hat enterprise linux';
  } else {
    return 'Linux/UNIX';
  }
};
ec2.describeReservedInstances().promise().then(res=>{
  let filterd = res.ReservedInstances.filter(reservedInstance=>{
    return (reservedInstance.State == 'active' && moment(reservedInstance.End) > end);
  });
  activeReserves = filterd.reduce((pre,cur)=>{let key =`${cur.InstanceType},${cur.ProductDescription}`.toLowerCase(); if(key in pre){pre[key]-=cur.InstanceCount}else{pre[key]=-cur.InstanceCount};return pre},{});
  console.log(activeReserves);
  ec2.describeInstances({Filters: [{Name: 'instance-state-name', Values: ['running']}]}).promise().then(res=>{
    let reservations = res.Reservations;
    ec2.describeImages({ImageIds: res.Reservations.reduce((pre,cur)=>pre.concat(cur.Instances), []).map(item=>item.ImageId)}).promise().then(res=>{
      let images = res.Images.reduce((pre,cur)=>{pre[cur.ImageId] = cur.Name; return pre},{});
      console.log(reservations.reduce((pre,cur)=>pre.concat(cur.Instances), []).map(item=>[item.InstanceType,item.Platform ? item.Platform : linuxType(images[item.ImageId],item.InstanceId)]).map(item=>item.join(',').toLowerCase()).reduce((pre,cur)=>{if(cur in pre) {pre[cur]++} else {pre[cur]=1};return pre},activeReserves));
    });
  });
});
