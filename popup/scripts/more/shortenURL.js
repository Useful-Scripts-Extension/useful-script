export function shortenURL() {
  window.open(
    `https://j2team.dev/home/?prefill_url=${encodeURIComponent(
      window.top.location.href
    )}&utm_source=bookmarklet`
  );
}
