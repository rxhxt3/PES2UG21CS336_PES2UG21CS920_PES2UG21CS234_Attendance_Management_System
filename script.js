document.addEventListener('DOMContentLoaded', async function () {
    const studentDetailsDiv = document.getElementById('studentDetails');

    // Connect to the Ethereum provider
    if (window.ethereum) {
        try {
            // Enable Ethereum provider
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } catch (error) {
            console.error('User denied account access:', error);
            // Handle error gracefully, inform user or provide alternative actions
            return;
        }
    } else {
        console.error('Web3 provider not found');
        // Handle error gracefully, inform user or provide alternative actions
        return;
    }

    // Contract ABI (replace with your actual ABI)
    const contractABI = [
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "classId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                }
            ],
            "name": "AttendanceMarked",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "studentId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "StudentEnrolled",
            "type": "event"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "attendanceRecords",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "classCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "students",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "attendance",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isEnrolled",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_studentId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "enrollStudent",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_classId",
                    "type": "uint256"
                }
            ],
            "name": "markAttendance",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "addClass",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_studentAddress",
                    "type": "address"
                }
            ],
            "name": "getStudent",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
    ];
    // Contract address (replace with your actual contract address)
    const contractAddress = '0x84d25E3340BaB95c4573D6aF4C806B965Bb8d7D9';

    // Create contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Function to enroll a student
    window.enrollStudent = async function() {
        try {
            const studentId = document.getElementById('studentId').value;
            const studentName = document.getElementById('studentName').value;

            // Call smart contract function to enroll student
            console.log('Enrolling student:', studentId, studentName);
            await contract.methods.enrollStudent(studentId, studentName).send({ from: web3.eth.defaultAccount });
            console.log('Student enrolled successfully');

            // Display student details after enrolling
            displayStudentDetails(studentId, studentName, 0); // Assuming initial attendance is 0
        } catch (error) {
            console.error('Error enrolling student:', error);
            // Handle error gracefully, inform user or provide alternative actions
        }
    };

    // Function to mark attendance for a class
    window.markAttendance = async function() {
        try {
            const classId = document.getElementById('classId').value;

            // Call smart contract function to mark attendance
            console.log('Marking attendance for class:', classId);
            await contract.methods.markAttendance(classId).send({ from: web3.eth.defaultAccount });
            console.log('Attendance marked successfully');
        } catch (error) {
            console.error('Error marking attendance:', error);
            // Handle error gracefully, inform user or provide alternative actions
        }
    };

    // Example of displaying student details (replace with actual data from smart contract)
    function displayStudentDetails(studentId, studentName, attendance) {
        const studentDetails = `
            <h2>Student Details</h2>
            <p>Student ID: ${studentId}</p>
            <p>Name: ${studentName}</p>
            <p>Attendance: ${attendance}</p>
        `;
        studentDetailsDiv.innerHTML = studentDetails;
    }
});