//Student's Class
class Student {
  constructor(firstName, lastName, email, phoneNumber, idCard, birthDate) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.idCard = idCard;
    this.birthDate = birthDate;
    this.isAccepted = false;
    this.passedEntryQuiz = false;
    this.passedSeriousGame = false;
    this.passedMotivationTest = false;
    this.passedAdministrationTest = false;
    this.passedTechnicalTest = false;
    this.id = null;
  }

  generateCredentials() {
    const { idCard, firstName } = this;

    let password = generatePassword(idCard);
    let credentialReference = `${idCard}${firstName}`;

    this.credentialReference = credentialReference;
    this.password = password;
  }

  hasValidAge() {
    const { birthDate } = this;

    let birthD = new Date(birthDate);
    let diff = Date.now() - birthD;
    let age = new Date(diff);
    let ageInYears = Math.abs(age.getUTCFullYear() - 1970);

    return ageInYears <= 18 && ageInYears >= 35 ? false : true;
  }

  async hasValidEmail() {
    const { email } = this;
    let validity = await isEmailUsed(email);
    return !validity;
  }
}

const form = document.getElementById("form");

//Utilities
const generatePassword = (idCard) => {
  let allCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let password = idCard;
  let charactersLength = allCharacters.length;

  for (let i = 0; i < 7; i++) {
    password += allCharacters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return password;
};

const isEmailUsed = async (email) => {
  let isUsed = false;
  let students = await getStudents();

  students.forEach((student) => {
    if (student.email === email) {
      isUsed = true;
    }
  });

  return isUsed;
};

const manageStudentData = async () => {
  let student = new Student(
    form.firstName.value,
    form.lastName.value,
    form.email.value.toLowerCase(),
    form.phoneNumber.value,
    form.idCard.value,
    form.dateOfBirth.value
  );

  if (student.hasValidEmail() && student.hasValidAge()) {
    student.generateCredentials();
    await pushStudent(student);
    sessionStorage.setItem("activeStudent", student.credentialReference);
    window.location.href = "Examination.html";
  } else {
    window.location.href = "index.html";
  }

  // console.log(student);
};

const getStudents = async () => {
  let students = [];
  await axios.get("http://localhost:3000/students").then((response) => {
    students = response.data;
  });
  return students;
};

const pushStudent = async (student) => {
  await axios
    .post("http://localhost:3000/students", student)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Question Class
class Question {
  constructor(questionItself, choices, answer) {
    this.questionItself = questionItself;
    this.choices = choices;
    this.answer = answer;
  }

  isCorrectAnswer = function (choice) {
    return this.answer === choice;
  };
}

//Quizz Class

class Quizz {
  constructor(score, questions, questionIndex) {
    this.score = 0;
    this.questions = questions;
    this.questionIndex = questionIndex;
  }

  getQuestion() {
    return this.questions[this.questionIndex];
  }

  guess(answer) {
    if (this.getQuestionIndex().isCorrectAnswer(answer)) {
      this.score++;
    }
    this.questionIndex++;
  }

  isQuizzEnded() {
    return this.questionIndex === this.questions.length;
  }
}

//Admin Class
class Admin {
  constructor(firstName, lastName, email, key) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.key = key;
  }

  validateStudent(student) {
    student.isAccepted = true;
  }
}
