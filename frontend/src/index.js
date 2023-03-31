const Web3 =require('web3')
let web3; 
let userWalletAddress;

const networkId = '0x61';
const networkRpcUrl = 'https://data-seed-prebsc-2-s1.binance.org:8545/';

const ABI= [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"studentId","type":"address"},{"indexed":true,"internalType":"uint256","name":"rollNo","type":"uint256"}],"name":"registration","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"}],"name":"cancelStudentRegistration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"}],"name":"showStudentDetails","outputs":[{"components":[{"internalType":"uint256","name":"rollNo","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"courseEnroll","type":"string"},{"internalType":"bool","name":"status","type":"bool"}],"internalType":"struct studentRegistration.student","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"},{"internalType":"string","name":"_studentName","type":"string"},{"internalType":"string","name":"_courseEnroll","type":"string"}],"name":"studentEnroll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"},{"internalType":"string","name":"_courseEnroll","type":"string"}],"name":"updateStudentCourse","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_studentID","type":"address"},{"internalType":"string","name":"_studentName","type":"string"}],"name":"updateStudentName","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const contractAddress = "0x5F926183016d6Df84f087D423Bbb071b6D72404E"
let contractInstance;

//connect Wallet
async function connect(){    
    if(typeof window.ethereum !== "undefined"){
      const ethereum = window.ethereum;
        web3 = new Web3(ethereum);
        console.log("WEB3",web3)
        await checkNetworkId();
        await ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          userWalletAddress=accounts[0];
          console.log(accounts); // an array of accounts
        })
        .catch(error => {
          console.error(error); // handle error
        });

        contractInstance = await new web3.eth.Contract(ABI, contractAddress);
        // web3.eth.getAccounts().then(accounts => {
        //   console.log("xxxx",accounts); // an array of accounts
        // }).catch(error => {
        //   console.error(error); // handle error
        // });

        console.log("userWalletAddress",userWalletAddress);
        document.getElementById("add").innerHTML = userWalletAddress;
    }
}    

async function checkNetworkId(){
    web3.eth.net.getId((error, currentNetworkId) => {
        if (error) {
          console.error(error);
          alert('An error occurred while fetching the current network ID.');
        } else {
            console.log("current networkID",currentNetworkId)
          if (currentNetworkId == networkId) {
            console.log('Already on desired network!');
          } else {
            ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkId }],
              }).then(() => {
                    console.log('Changed network to Desired Network!');
                    // Update the Web3 instance with the new network
                    
              })
              .catch((error) => console.error(error));
          }
        }
      });
      
}
async function check(){
  if(typeof web3 === 'undefined'){
    await connect();
  }
  const netId = await web3.eth.net.getId();
  if (networkId !== netId) {
      await connect();    
  }    
  accounts = await web3.eth.getAccounts();
  return accounts[0];
}

//student Registration
const dataForm = document.getElementById('studentRegister');
dataForm.addEventListener('submit', async function register(event){
    // Handle the form submission    
    event.preventDefault();
    const walletId = document.getElementById('walletId').value;
    const studentName = document.getElementById('studentName').value;
    const studentCourse = document.getElementById('studentCourse').value;
    console.log("we are here",walletId,studentName,studentCourse);
    console.log("WEB3",web3);    
    userWalletAddress = await check();
    console.log("Connected Wallet Address:",userWalletAddress);
    const tx = {
        from:userWalletAddress,
        to: contractAddress,
        gas: 800000,
        data: contractInstance.methods.studentEnroll(walletId, studentName, studentCourse).encodeABI() 
    }
    
    await web3.eth.sendTransaction(tx)
        .then((transactionHash) => {
          console.log("Transaction hash:",transactionHash);
          alert('Student Registration is successful!');
        })
        .catch((error) => {
          console.error(`Error: ${error}`);
          alert('An error occurred while sending data to the blockchain.');
        });
          
});

//Display student Record
const studentDataForm = document.getElementById('studentData');
studentDataForm.addEventListener('submit', async function studentRecord(event){
    // Handle the form submission    
    event.preventDefault();
    if(typeof web3 === 'undefined'){
        web3Read = await new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-2-s1.binance.org:8545/'));
        console.log("web3 found",web3Read);
        contractInstance = await new web3Read.eth.Contract(ABI, contractAddress);
    }    
    const walletId = document.getElementById('studentWalletID').value;
    await contractInstance.methods.showStudentDetails(walletId).call()
    .then(message =>{    
      console.log("=roll No of student---------------------------",message.rollNo);
      console.log("name of student---------------------------",message.name);
      console.log("course enrolled by student---------------------------",message.courseEnroll);
      console.log("isEnrolledNow---------------------------",message.status);
      alert("Details fetched...")
      document.getElementById("stRecord").style.display="table";
      document.getElementById("stRoll").innerHTML = message.rollNo;   
      document.getElementById("stName").innerHTML = message.name;   
      document.getElementById("stCourse").innerHTML = message.courseEnroll;
    }).catch(()=>{
      alert("No Record Found")
      console.log("Provide correct student wallet address");
      document.getElementById("stRecord").style.display="none";
    })  
});

//Update Student Name
const updateName = document.getElementById('updatestName');
updateName.addEventListener('submit', async function register(event){
    // Handle the form submission    
    event.preventDefault();
    const walletId = document.getElementById('stIDupdate').value;
    const studentName = document.getElementById('stNameupdate').value;
    console.log("we are here",walletId,studentName);
    console.log("WEB3",web3);
    userWalletAddress = await check();
    console.log("Connected Wallet Address:",userWalletAddress);
    const tx = {
        from:userWalletAddress,
        to: contractAddress,
        gas: 800000,
        data: contractInstance.methods.updateStudentName(walletId, studentName).encodeABI() 
    }
    
    await web3.eth.sendTransaction(tx)
        .then((transactionHash) => {
          console.log("Transaction hash:",transactionHash);
          alert('Name updated successfully!');
        })
        .catch((error) => {
          console.error(`Error: ${error}`);
          alert('An error occurred while sending data to the blockchain.');
        });
});

//update student Course
const updatestCourse = document.getElementById('updatestCourse');
updatestCourse.addEventListener('submit', async function register(event){
    // Handle the form submission    
    event.preventDefault();
    const walletId = document.getElementById('stIDCupdate').value;
    const studentCourse = document.getElementById('stCourseupdate').value;
    console.log("we are here",walletId,studentCourse);
    console.log("WEB3",web3);
    userWalletAddress = await check();
    console.log("Connected Wallet Address:",userWalletAddress);
    const tx = {
        from:userWalletAddress,
        to: contractAddress,
        gas: 800000,
        data: contractInstance.methods.updateStudentCourse(walletId, studentCourse).encodeABI() 
    }
    
    await web3.eth.sendTransaction(tx)
        .then((transactionHash) => {
          console.log("Transaction hash:",transactionHash);
          alert('Course updated successfully!');
        })
        .catch((error) => {
          console.error(`Error: ${error}`);
          alert('An error occurred while sending data to the blockchain.');
        });
});

//delete Student Record
const deleteRecord = document.getElementById('deleteRecord');
deleteRecord.addEventListener('submit', async function register(event){
    // Handle the form submission    
    event.preventDefault();
    const walletId = document.getElementById('stIDdel').value;
    console.log("we are here",walletId);
    console.log("WEB3",web3);
    userWalletAddress = await check();
    console.log("Connected Wallet Address:",userWalletAddress);
    const tx = {
        from:userWalletAddress,
        to: contractAddress,
        gas: 800000,
        data: contractInstance.methods.cancelStudentRegistration(walletId).encodeABI() 
    }
    
    await web3.eth.sendTransaction(tx)
        .then((transactionHash) => {
          console.log("Transaction hash:",transactionHash);
          alert('Student Record Deleted Successfully!');
        })
        .catch((error) => {
          console.error(`Error: ${error}`);
          alert('An error occurred while sending data to the blockchain.');
        });
});


module.exports ={
    connect,
 }