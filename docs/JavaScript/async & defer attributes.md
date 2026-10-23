---
sidebar_position: 9
---

async executes the script the moment it finishes downloading (which pauses HTML parsing), whereas defer waits for the HTML parsing to completely finish before executing the script in the order it appears on the page.


DEFAULT script tag:
1. HTML parsing is paused for download and execution
2. The scripts are executed immediately upon discovery/ arrival
3. Execution Order: The scripts are executed in an ordered manner(as they appear in HTML).
4. DOM Dependent? : Safe(if placed at the bottom)

script async tag:
1. HTML parsing is paused only during execution.
2. The scripts are executed immediately after download completes. 
3. Execution Order: Unordered(load-first basis)
4. DOM Dependent? : Unsafe(may run before DOM is ready)

script defer tag: 
1. HTML Parsing is never paused. 
2. The scripts are executed after the DOM is fully parsed.
3. Execution Order: Ordered(as they appear in HTML)
4.  DOM Dependent? : Safe(always runs after dom is ready)


When to Use Which

Use async when:
1. The script is completely independent.
2. It does not rely on other scripts.
3. It does not need to manipulate the DOM.
Examples: Analytics tools like Google Analytics, ad tracking pixels, or heatmaps.

Use defer when:
1. The script relies on the full DOM being built.
2. The script depends on, or is depended on by, another script.
Examples: UI interaction scripts, application bootloaders, or frameworks like React or Vue packages.