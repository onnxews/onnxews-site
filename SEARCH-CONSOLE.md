# Google Search Console — Manual Guide for Orbit News Network (onnxews.com)

This guide is for the site owner (Peter Osibajo). Every step below requires
signing in to Google Search Console with the Google account that owns the
property. **Nothing in this file was pulled from Search Console itself** —
no one on the team has accessed the account while writing it. Figures quoted
here are from the last live check, dated below, and are **not current**.

- **Property:** `onnxews.com` (domain property)
- **Ownership:** verified on **2026-10-20**. If Search Console ever asks you to
  re-verify, use the DNS TXT record method in Cloudflare (where the domain
  is registered) or the HTML file upload method — do not change anything
  else on the site to do it.
- **Sitemaps:** `sitemap.xml` was submitted on **2026-11-01**.
  `news-sitemap.xml` is also listed in `robots.txt`.
- **Last checked (not current):** on **2026-11-07** a live check showed
  **23 clicks, 699 impressions, 3.3% CTR, average position 8.9**. Treat those
  numbers as a snapshot from that date only — check the Performance report
  below for today's figures.

---

## 1. Signing in

1. Go to <https://search.google.com/search-console>.
2. Sign in with the Google account that owns the `onnxews.com` property.
3. If you see more than one property, pick the **domain property**
   `onnxews.com` (not a URL-prefix property — the domain property covers
   `https://onnxews.com`, `https://www.onnxews.com`, and all subpaths).

If you are asked to verify ownership again, follow the on-screen method
(DNS TXT record in Cloudflare is the usual one for this domain) and do not
delete the verification record afterwards — removing it can drop the
verification.

## 2. Submit / resubmit the sitemaps

Do this after any batch of site changes (new pages, new articles, or a
sitemap rebuild), and whenever Search Console shows a sitemap error.

1. Left menu → **Sitemaps**.
2. You should see `https://onnxews.com/sitemap.xml` (submitted 2026-11-01).
   Check its **Status** — it should say **Success** and show a recent
   "Last read" date and the number of discovered URLs.
3. If it is missing, type `sitemap.xml` in the "Add a new sitemap" box and
   click **Submit**.
4. Also submit the news sitemap: type `news-sitemap.xml` and click
   **Submit**. This one only ever lists articles from the last 2 days, so
   its URL count is small (around 70) — that is normal.
5. If a sitemap shows an error, click it to see the detail (e.g. "couldn't
   fetch" usually means a temporary deploy hiccup — wait and resubmit; a
   parse error means the file itself needs fixing before resubmitting).

## 3. Check whether pages are indexed

1. Left menu → **Indexing → Pages**.
2. The summary shows **Indexed** vs **Not indexed** counts. A new article
   normally takes hours to a few days to appear as indexed — do not expect
   same-day indexing for every story.
3. Scroll to **"Why pages aren't indexed"** and review each reason:
   - **Discovered – currently not indexed** and **Crawled – currently not
     indexed**: Google knows about the page but has not indexed it (yet).
     Common for a young site with many similar pages. Check back after a
     week; if a specific important page stays here, inspect it (see §4)
     and use **Request indexing**.
   - **Duplicate without user-selected canonical**: Google picked a
     different canonical than the page declares. Check the page's
     `<link rel="canonical">` — every Orbit News page self-canonicalises,
     so this usually means Google prefers another near-identical page.
     Do not delete either page; fix the duplication instead.
   - **Soft 404 / Not found (404) / Server error (5xx)**: real problems —
     fix the page or link, then click **Validate fix**.
   - **Blocked by robots.txt**: should not happen — `robots.txt` allows
     everything and lists both sitemaps. If you see it, check that
     `robots.txt` was not changed by mistake.
4. Click any reason to list the affected URLs, and export the list if you
   need to hand it to someone for fixing.

## 4. Inspect an individual article URL

Use this for any specific story you care about (e.g. a story that is not
showing up in Google).

1. Paste the full URL (e.g. `https://onnxews.com/story/<slug>`) into the
   **Inspect URL** bar at the top and press Enter.
2. Read the verdict: **"URL is on Google"** (indexed, with the date Google
   last crawled it) or **"URL is not on Google"** (with the reason).
3. If it is not indexed, click **Test live URL** to confirm Google can
   fetch the page right now, then click **Request indexing**. Request
   indexing is a request, not a guarantee — allow several days.
4. The inspection also shows the **user-declared canonical** vs the
   **Google-selected canonical** — they should match (both the article
   URL itself). If they differ, note the pair; it usually points to a
   duplicate-content issue between two pages.

## 5. Review queries, impressions, clicks and CTR

1. Left menu → **Performance → Search results**.
2. The default view is the last 3 months. Tick **Total clicks**,
   **Total impressions**, **Average CTR**, and **Average position**.
3. Use the tabs below the graph:
   - **Queries**: the exact search terms people typed that showed the
     site. Look for the terms driving the most clicks, and for queries
     with high impressions but low CTR — those pages may need better
     titles or descriptions.
   - **Pages**: which URLs get the clicks and impressions. Compare the
     newest articles against older ones.
   - **Countries / Devices**: where the traffic comes from and whether it
     is mobile or desktop.
4. Change the date range to compare periods (e.g. last 28 days vs the
   previous 28 days) after a site change, to see whether clicks or
   average position moved.
5. Remember the baseline from the last check (**2026-11-07: 23 clicks,
   699 impressions, 3.3% CTR, average position 8.9**) — compare new
   figures against that snapshot, not against zero.

## 6. Find crawl and indexing errors

1. Left menu → **Settings → Crawl stats** (under "Crawl"): check that
   Googlebot is visiting regularly and that the **average response time**
   is low. A sudden drop in crawl requests, or a spike in response time,
   is worth investigating.
2. Left menu → **Indexing → Pages** (§3 above) is the main error list.
   Work through the reasons in this order: server errors (5xx) and
   404s first, then soft 404s, then duplicate/canonical issues, then
   "crawled – currently not indexed".
3. After fixing a batch of errors, use **Validate fix** on that issue —
   Google re-checks the affected URLs over the following days and reports
   whether the fix held.
4. **Security issues & Manual actions** (left menu): both should read
   "No issues detected". If either ever shows an issue, that is urgent —
   follow Google's instructions on that page before anything else.

## 7. Google News and Discover performance

These reports only appear when Google has shown the site in those
surfaces — they may be empty for a young site, and that is normal.

1. **Google News**: left menu → **Performance → Google News** (appears
   only if the site has appeared in Google News). It shows clicks,
   impressions and CTR for News surfaces. Note that appearing here does
   not require an application — Google decides based on the content and
   on `news-sitemap.xml` being submitted and kept fresh (it is rebuilt
   with every daily batch and covers only the last 2 days).
2. **Discover**: left menu → **Performance → Discover** (appears only if
   the site has appeared in Discover). It shows the same metrics for
   Discover cards. Discover traffic is driven by large, high-quality
   images and by topics Google judges of interest — there is nothing to
   submit for it.
3. If neither report exists yet, do not worry: keep publishing, keep the
   news sitemap fresh, and check back monthly. There is no form to fill
   in to "join" either surface.

## 8. Quick routine (monthly, ~15 minutes)

1. Sign in; check **Performance → Search results** (last 28 days) and
   note clicks, impressions, CTR, average position.
2. Check **Indexing → Pages** for new errors; fix or note any 5xx/404.
3. Check **Sitemaps** — both sitemaps Success with a recent "Last read".
4. Spot-inspect 2–3 of the newest article URLs (§4) to confirm they are
   indexed.
5. If anything looks wrong, note the exact URL and the exact message
   Search Console shows — that is what is needed to fix it.

## 9. What Search Console cannot do

- It cannot make Google index a page on demand — **Request indexing**
  is a request, not an order, and it does not speed up ranking.
- It cannot show you who visited the site or what any individual reader
  did — only aggregated search queries and clicks.
- It does not cover social traffic (Facebook, X, Instagram) or direct
  visits — only Google Search, Google News, and Discover.
- It does not fix content quality: pages that are thin, duplicated, or
  near-copies of other outlets' reporting can be indexed and still rank
  poorly. Indexing is the floor, not the goal.
