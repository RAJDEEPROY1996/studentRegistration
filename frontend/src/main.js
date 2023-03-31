const Web3 = require('web3');

require('dotenv').config();
const { privateKey} = process.env;


const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
 
const ABI= [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"studentId","type":"address"},{"indexed":true,"internalType":"uint256","name":"rollNo","type":"uint256"}],"name":"registration","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"}],"name":"cancelStudentRegistration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"}],"name":"showStudentDetails","outputs":[{"components":[{"internalType":"uint256","name":"rollNo","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"courseEnroll","type":"string"},{"internalType":"bool","name":"status","type":"bool"}],"internalType":"struct studentRegistration.student","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"},{"internalType":"string","name":"_studentName","type":"string"},{"internalType":"string","name":"_courseEnroll","type":"string"}],"name":"studentEnroll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"},{"internalType":"string","name":"_courseEnroll","type":"string"}],"name":"updateStudentCourse","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"},{"internalType":"string","name":"_studentName","type":"string"}],"name":"updateStudentName","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const contractAddress = "0x8aef8b6c9571FA223f16354F28c1665fC0f4b6A1"

const myAddress = "0x688612BD8e65FF693070A875b6a49672502a0707"

let instance;
const connect = async() => {
    instance = new web3.eth.Contract(ABI,contractAddress);
} 

const studentEnroll = async(_studentWalletAddress, _studentName,_courseEnroll) => {
    const tx = {
        from:myAddress,
        to: contractAddress,
        gas: 8000000,
        data: instance.methods.studentEnroll(_studentWalletAddress, _studentName, _courseEnroll).encodeABI() 
    }
    const signature = await web3.eth.accounts.signTransaction(tx,privateKey);
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt",(receipt) =>{
            console.log("---------------------------");
            console.log("student enrolled successfully.... ");
            console.log("---------------------------");
            console.log(receipt);
        }
    ).on('error', console.error);
}


const showStudentDetail = async(_studentWalletAddress) => {
    await instance.methods.showStudentDetails(_studentWalletAddress).call()
    .then(message =>{    
      console.log("=roll No of student---------------------------",message.rollNo);
      console.log("name of student---------------------------",message.name);
      console.log("course enrolled by student---------------------------",message.courseEnroll);
      console.log("isEnrolledNow---------------------------",message.status);
    }).catch(()=>{
      console.log("Provide correct student wallet address")
    })  
}
  
const updateStudentName = async(_studentWalletAddress, _studentName) => {
    const tx = {
        from:myAddress,
        to: contractAddress,
        gas: 800000,
        data: instance.methods.updateStudentName(_studentWalletAddress,_studentName).encodeABI() 
    }
    const signature = await web3.eth.accounts.signTransaction(tx,privateKey);
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt",(receipt) =>{
            console.log("---------------------------");
            console.log("student Name updated successfully.... ");
            console.log("---------------------------");
            console.log(receipt);
        }
    ).on('error', console.error);
}
  
const updateStudentCourse = async(_studentWalletAddress, _courseEnrolled) => {
    const tx = {
        from:myAddress,
        to: contractAddress,
        gas: 800000,
        data: instance.methods.updateStudentCourse(_studentWalletAddress,_courseEnrolled).encodeABI() 
    }
    const signature = await web3.eth.accounts.signTransaction(tx,privateKey);
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt",(receipt) =>{
            console.log("---------------------------");
            console.log("student course enrolled updated successfully.... ");
            console.log("---------------------------");
            console.log(receipt);
        }
    ).on('error', console.error);
}
  
  
const cancelStudentRegistration = async(_studentWalletAddress) => {
    const tx = {
        from:myAddress,
        to: contractAddress,
        gas: 8000000,
        data: instance.methods.cancelStudentRegistration(_studentWalletAddress).encodeABI() 
    }
    const signature = await web3.eth.accounts.signTransaction(tx,privateKey);
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt",(receipt) =>{
            console.log("---------------------------");
            console.log("student record deleted successfully.... ");
            console.log("---------------------------");
            console.log(receipt);
        }
    ).on('error', console.error);
}

connect()
//studentEnroll('0x720547044b94a2a2F1d264631800B8a80b2c5776', 'Rajdeep','M.Tech');         //create student details
showStudentDetail('0x720547044b94a2a2F1d264631800B8a80b2c5776');                         //read student details
//updateStudentName('0x720547044b94a2a2F1d264631800B8a80b2c5776', 'Rajdeep Roy');          //update student name
//updateStudentCourse('0x720547044b94a2a2F1d264631800B8a80b2c5776','M.Tech in CSE');       //update student enrolled course
// cancelStudentRegistration('0x720547044b94a2a2F1d264631800B8a80b2c5776')                  //delete student record
