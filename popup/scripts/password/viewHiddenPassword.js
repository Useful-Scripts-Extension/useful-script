export function viewHiddenPassword() {
  var s, F, j, f, i;
  s = "";
  F = document.forms;
  for (j = 0; j < F.length; ++j) {
    f = F[j];
    for (i = 0; i < f.length; ++i) {
      if (f[i].type.toLowerCase() == "password") s += f[i].value + "\n";
    }
  }
  if (s) prompt("Passwords in forms on this page:", s);
  else alert("There are no passwords in forms on this page.");
}
