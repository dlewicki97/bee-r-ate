export default function generateAvatar(username) {
  let splitNameArr = username.trim().split(" ");

  switch (splitNameArr.length) {
    case 1: {
      const splitNameStr = splitNameArr[0].toString();
      return splitNameStr[0];
    }
    default: {
      const splitNameStrFirst = splitNameArr[0].toString();
      const splitNameStrLast = splitNameArr[splitNameArr.length - 1].toString();
      return splitNameStrFirst[0] + splitNameStrLast[0];
    }
  }
}
