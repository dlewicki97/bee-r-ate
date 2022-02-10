export default function translateErrors(errCode) {
  console.log(errCode);
  switch (errCode.toString()) {
    case "auth/user-not-found": {
      return "Nie znaleziono użytkownika";
    }
    case "auth/email-already-exists": {
      return "Email jest zajęty";
    }
    case "auth/email-already-in-use": {
      return "Email jest zajęty";
    }
    case "auth/wrong-password": {
      return "Błędne hasło";
    }
    case "auth/invalid-email": {
      return "Błędny format email";
    }
    case "auth/too-many-requests": {
      return "Zbyt wiele nieudanych prób logowania. Spróboj ponownie później";
    }
    case "auth/internal-error": {
      return "Błąd serwera";
    }
    default: {
      return "Wystąpił błąd!";
    }
  }
}
