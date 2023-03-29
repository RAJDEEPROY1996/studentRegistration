// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract studentRegistration{

    struct student{
        uint rollNo;
        string name;
        string courseEnroll;
        bool status;
    }

    uint public count;
    address public admin;
    mapping(address => student) studentDetails;
    event registration(address indexed studentId, uint indexed rollNo);
    
    constructor(){
        admin = msg.sender;
    }

    function changeAdmin(address _newOwner) public{
        require(admin == msg.sender,"only admin can change admin");
        admin = _newOwner;
    }

    function studentEnroll(address _studentID, string memory _studentName,string memory _courseEnroll) public {
        require(admin == msg.sender,"only admin can register student");
        student memory st = studentDetails[_studentID];
        require(!st.status,"Already registered using this address");
        ++count;
        st.rollNo = count;
        st.name = _studentName;
        st.courseEnroll = _courseEnroll;
        st.status = true;
        studentDetails[_studentID] = st;
        emit registration(_studentID,count);
    }

    function showStudentDetails(address _studentID) public view returns(student memory){
        student memory st = studentDetails[_studentID];
        require(st.status,"No student registered using this address");
        return st;
    }

    function updateStudentName(address _studentID, string memory _studentName) public {
        require(admin == msg.sender || _studentID == msg.sender,"only admin or student can update details");
        student memory st = studentDetails[_studentID];
        require(st.status,"No student registered using this address");
        st.name = _studentName;
        studentDetails[_studentID] = st;
    }

    function updateStudentCourse(address _studentID, string memory _courseEnroll) public {
        require(admin == msg.sender || _studentID == msg.sender,"only admin or student can update details");
        student memory st = studentDetails[_studentID];
        require(st.status,"No student registered using this address");
        st.courseEnroll = _courseEnroll;
        studentDetails[_studentID] = st;
    }

    function cancelStudentRegistration(address _studentID) public {
        require(admin == msg.sender || _studentID == msg.sender,"only admin or student can update details");
        student memory st = studentDetails[_studentID];
        require(st.status,"No student registered using this address");
        delete studentDetails[_studentID];
    }
}
