// https://blogchiasekienthuc.com/thu-thuat-hay/huy-theo-doi-toan-bo-nguoi-la-tren-facebook.html

/*
 * Code by JayremntB, 2020
 * Requirement: New Facebook
 * Please copy all the code to make sure that you will not get any errors
 * Before run this script, please switch to NEW Facebook and navigate to this link: https://www.facebook.com/me/friends
 */

// Don't modify code below
(() => {
  console.log("\x1b[36m%s\x1b[0m", "Code by JayremntB, 2020");
  console.log(
    "\x1b[36m%s\x1b[0m",
    "Please remember if you meet an error, just reload page, wait for 3 seconds and run the code again"
  );
  console.log("Searching...");
  let userIndex = 0;
  setTimeout(function continuousWhenPageLoad() {
    let users = document.getElementsByClassName(
      "bp9cbjyn ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi n1f8r23x rq0escxv j83agx80 bi6gxh9e discj3wi hv4rvrfc ihqw7lf3 dati1w0a gfomwglr"
    );
    if (users.length === 0 || userIndex + 8 > users.length - 1)
      return console.warn("DONE! You have reached the end of list friends.");
    //
    setTimeout(function checkNextUser() {
      if (userIndex + 8 > users.length - 1) {
        window.scrollTo(0, document.body.scrollHeight); // scroll to the end of page
        setTimeout(continuousWhenPageLoad, 3000);
        return;
      }
      if (users[userIndex].firstChild.hasAttribute("aria-hidden")) {
        // click Friends button
        users[userIndex].lastChild.firstChild.firstChild.firstChild.click();
        // click Unfriend button
        setTimeout(() => {
          const listButtonsInSubmenu = document.getElementsByClassName(
            "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 oi9244e8 oygrvhab h676nmdw cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn dwo3fsh8 btwxx1t3 pfnyh3mw du4w35lb"
          );
          listButtonsInSubmenu[listButtonsInSubmenu.length - 1].click();
          // click Confirm button
          return setTimeout(() => {
            document
              .getElementsByClassName(
                "oajrlxb2 s1i5eluu gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys d1544ag0 qt6c0cv9 tw6a2znq i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l beltcj47 p86d2i9g aot14ch1 kzx2olss cbu4d94t taijpn5t ni8dbmo4 stjgntxs k4urcfbm tv7at329"
              )[0]
              .click();
            const friendName =
              users[userIndex++].firstChild.nextSibling.firstChild.textContent;
            console.log(
              `Removed ${friendName} as a friend! Continuously searching...`
            );
            setTimeout(checkNextUser, 0);
          }, 200);
        }, 1500);
      } else {
        userIndex++;
        setTimeout(checkNextUser, 0);
      }
    }, 0);
  }, 0);
})();
