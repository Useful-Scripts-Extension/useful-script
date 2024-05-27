import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { fetchAllAddedFriendsSince, fetchAllFriends_ } from "./fb_GLOBAL.js";
import { Storage } from "./helpers/utils.js";

let storageKey = "fb_detectUnfriend";

(async () => {
  // let cached = await Storage.get(storageKey);

  let token =
    "EAABwzLixnjYBO8kDAvMmrY41ZBZAe1jIZBoiFZBHJRIZAZCZBLZBZBXpzdZAoZABVFYPZAm3KHtFTf2dsd3maTIB54Ypj1l7xZBtwb9kcH5UWf1LO2eTZBaS5aemtPpNbN3FCoTtokzWjokzb8mxUoydfv1uEIaALWWJZAKWoqM6pO5TU9zZB3hQaxzICEUlCuMxfIpQ2AqOYX0iJzTRCnRqZCc8BbLGI3t2zPQZDZD";
  if (token) {
    let friends = await fetchAllFriends_(token, ({ data, loaded, total }) => {
      UfsGlobal.DOM.notify({
        msg: `${loaded} / ${total} - ${data.length} Friends`,
      });
    });
    console.log(friends);
  }
})();

async function fetchAllFriends(progressCallback) {
  let uid = await getYourUserId();
  let dtsg = await getFbdtsg();
  const allFriends = await fetchAllAddedFriendsSince(
    uid,
    dtsg,
    null,
    progressCallback
  );
  return allFriends;
}
