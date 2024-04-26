pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;
contract AttendanceContract {
    // Define structure for a student
    struct Student {
        string name;
        uint attendance;
    }
    
    // Mapping to store student information
    mapping(uint => mapping(address => Student)) public students;
    
    // Event to track attendance marking
    event AttendanceMarked(uint indexed studentId, string name, uint attendance);
    
    // Function to enroll a student
    function enrollStudent(uint _studentId, string memory _name) public {
        require(bytes(_name).length > 0, "Name must not be empty");
        require(students[_studentId][msg.sender].attendance == 0, "Student already enrolled");
        
        students[_studentId][msg.sender] = Student(_name, 0);
    }
    
    // Function to mark attendance for a class
    function markAttendance(uint _studentId) public {
        require(bytes(students[_studentId][msg.sender].name).length > 0, "Student not enrolled");
        
        students[_studentId][msg.sender].attendance++;
        emit AttendanceMarked(_studentId, students[_studentId][msg.sender].name, students[_studentId][msg.sender].attendance);
    }
    
    // Function to get attendance of a student for a specific class
    function getStudentAttendance(uint _studentId) public view returns(string memory, uint) {
        return (students[_studentId][msg.sender].name, students[_studentId][msg.sender].attendance);
    }
    
    // Function to get attendance of all students for a specific class
    function getClassAttendance() public view returns(uint[] memory, string[] memory, uint[] memory) {
        uint length = getEnrolledStudentsCount();
        
        uint[] memory studentIds = new uint[](length);
        string[] memory studentNames = new string[](length);
        uint[] memory studentAttendances = new uint[](length);
        
        uint index = 0;
        for (uint i = 0; i < 1000; i++) { // Assuming maximum student ID is 1000
            if (bytes(students[i][msg.sender].name).length > 0) {
                studentIds[index] = i;
                studentNames[index] = students[i][msg.sender].name;
                studentAttendances[index] = students[i][msg.sender].attendance;
                index++;
            }
        }
        
        return (studentIds, studentNames, studentAttendances);
    }
    
    // Function to get the count of enrolled students for a specific class
    function getEnrolledStudentsCount() internal view returns (uint count) {
        for (uint i = 0; i < 1000; i++) { // Assuming maximum student ID is 1000
            if (bytes(students[i][msg.sender].name).length > 0) {
                count++;
            }
        }
    }
}
