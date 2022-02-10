import store from "@/store/store";
import { db } from "@/firebase/firebase";
import firebase from "firebase/app";

export default async function calculateAverages(room) {
  store.commit("loading", true);

  let beerList = room.beerList;
  beerList.forEach((beer) => {
    let avgAppearanceScore = () => {
      let sum = 0;
      beer.userScores.forEach((scores) => (sum += scores.appearanceScore));
      return sum / beer.userScores.length;
    };
    let avgScore = () => {
      let sum = 0;
      beer.userScores.forEach((scores) => (sum += scores.avgScore));
      return sum / beer.userScores.length;
    };
    let avgSensationsScore = () => {
      let sum = 0;
      beer.userScores.forEach((scores) => (sum += scores.sensationsScore));
      return sum / beer.userScores.length;
    };
    let avgSmellScore = () => {
      let sum = 0;
      beer.userScores.forEach((scores) => (sum += scores.smellScore));
      return sum / beer.userScores.length;
    };
    let avgSubjectiveScore = () => {
      let sum = 0;
      beer.userScores.forEach((scores) => (sum += scores.subjectiveScore));
      return sum / beer.userScores.length;
    };
    let avgTasteScore = () => {
      let sum = 0;
      beer.userScores.forEach((scores) => (sum += scores.tasteScore));
      return sum / beer.userScores.length;
    };
    beer.avgAppearanceScore = avgAppearanceScore();
    beer.avgScore = avgScore();
    beer.avgSensationsScore = avgSensationsScore();
    beer.avgSmellScore = avgSmellScore();
    beer.avgSubjectiveScore = avgSubjectiveScore();
    beer.avgTasteScore = avgTasteScore();

    if (room.modID === store.getters.user.uid) {
      db.collection("beers")
        .doc(beer.beerID)
        .get()
        .then((beerDoc) => {
          let data = beerDoc.data();

          data.avgAppearanceScore =
            (avgAppearanceScore() +
              data.avgAppearanceScore * data.averageCount) /
            (data.averageCount + 1);
          data.avgScore =
            (avgScore() + data.avgScore * data.averageCount) /
            (data.averageCount + 1);
          data.avgSensationsScore =
            (avgSensationsScore() +
              data.avgSensationsScore * data.averageCount) /
            (data.averageCount + 1);
          data.avgSmellScore =
            (avgSmellScore() + data.avgSmellScore * data.averageCount) /
            (data.averageCount + 1);
          data.avgSubjectiveScore =
            (avgSubjectiveScore() +
              data.avgSubjectiveScore * data.averageCount) /
            (data.averageCount + 1);
          data.avgTasteScore =
            (avgTasteScore() + data.avgTasteScore * data.averageCount) /
            (data.averageCount + 1);

          db.collection("beers")
            .doc(beer.beerID)
            .update({
              ...data,
              averageCount: firebase.firestore.FieldValue.increment(1),
            });
        });
    }
  });

  let participants = room.participants;
  participants.forEach((participant) => {
    if (!participant.isEliminated) {
      let appearance = () => {
        let sum = 0;
        beerList.forEach(
          (beer) =>
            (sum +=
              beer.userScores[
                beer.userScores.indexOf(
                  beer.userScores.find(
                    (scores) => scores.userID == participant.userID
                  )
                )
              ].appearanceScore)
        );
        return sum / beerList.length;
      };

      let overall = () => {
        let sum = 0;
        beerList.forEach(
          (beer) =>
            (sum +=
              beer.userScores[
                beer.userScores.indexOf(
                  beer.userScores.find(
                    (scores) => scores.userID == participant.userID
                  )
                )
              ].avgScore)
        );
        return sum / beerList.length;
      };

      let sensations = () => {
        let sum = 0;
        beerList.forEach(
          (beer) =>
            (sum +=
              beer.userScores[
                beer.userScores.indexOf(
                  beer.userScores.find(
                    (scores) => scores.userID == participant.userID
                  )
                )
              ].sensationsScore)
        );
        return sum / beerList.length;
      };

      let smell = () => {
        let sum = 0;
        beerList.forEach(
          (beer) =>
            (sum +=
              beer.userScores[
                beer.userScores.indexOf(
                  beer.userScores.find(
                    (scores) => scores.userID == participant.userID
                  )
                )
              ].smellScore)
        );
        return sum / beerList.length;
      };

      let subjective = () => {
        let sum = 0;
        beerList.forEach(
          (beer) =>
            (sum +=
              beer.userScores[
                beer.userScores.indexOf(
                  beer.userScores.find(
                    (scores) => scores.userID == participant.userID
                  )
                )
              ].subjectiveScore)
        );
        return sum / beerList.length;
      };

      let taste = () => {
        let sum = 0;
        beerList.forEach(
          (beer) =>
            (sum +=
              beer.userScores[
                beer.userScores.indexOf(
                  beer.userScores.find(
                    (scores) => scores.userID == participant.userID
                  )
                )
              ].tasteScore)
        );
        return sum / beerList.length;
      };

      participant.avgScores.appearance = appearance();
      participant.avgScores.overall = overall();
      participant.avgScores.sensations = sensations();
      participant.avgScores.smell = smell();
      participant.avgScores.subjective = subjective();
      participant.avgScores.taste = taste();
    }
  });

  await db
    .collection("rooms")
    .doc(room.id)
    .update({ participants, beerList, inProgress: false, ended: true })
    .then(() => {
      store.commit("snackbar", "A o to wyniki!");
      store.commit("loading", false);
    })
    .catch(() => {
      store.commit("snackbar", "Błąd serwera, przepraszamy...");
      store.commit("loading", false);
    });
}
