# [1.6.0](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.5.1...v1.6.0) (2026-04-02)


### Features

* add Gordon Ramsay GIF ID map with rage tier buckets ([b598e51](https://github.com/diazjhozua/ragebait-kitchen/commit/b598e511c7e728c76845c68d9777f9f2adea7118))
* add GordonGif component with loading skeleton and GIPHY attribution ([ef27b79](https://github.com/diazjhozua/ragebait-kitchen/commit/ef27b79a72b4b8fa078d0f666e10eeb692cd08e5))
* show Gordon Ramsay GIF in verdict card between score ring and tags ([91bcccb](https://github.com/diazjhozua/ragebait-kitchen/commit/91bcccb45060df3febc319c4c2ac714a27200cc6))

## [1.5.1](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.5.0...v1.5.1) (2026-04-02)


### Bug Fixes

* **leaderboard:** refresh data automatically after entry submission ([9e8cb09](https://github.com/diazjhozua/ragebait-kitchen/commit/9e8cb09965a62e6a370e33c7f7b2808f8cc0062d))

# [1.5.0](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.4.0...v1.5.0) (2026-03-30)


### Bug Fixes

* **animation:** stop score wiggle after 2 seconds instead of looping forever ([be3c551](https://github.com/diazjhozua/ragebait-kitchen/commit/be3c55147224e1fd7ff73b688e613746677d234a))
* **form:** clear recipe content and title after submission ([389de1f](https://github.com/diazjhozua/ragebait-kitchen/commit/389de1f100b324871ed167aa46dd87bab932df4c))


### Features

* **leaderboard:** clear XP profiles when leaderboard is cleared ([a71475b](https://github.com/diazjhozua/ragebait-kitchen/commit/a71475bf3c6c7bd9d29c23701a18b4fdc98ba650))
* **leaderboard:** require passcode to clear leaderboard ([33ebe78](https://github.com/diazjhozua/ragebait-kitchen/commit/33ebe78ae0fbe39c5d9129f770feb26fc04a875d))
* **notifications:** persist XP notifications until dismissed with smooth slide-in ([ece728d](https://github.com/diazjhozua/ragebait-kitchen/commit/ece728da4e7def163dfeed7cf68d9a9d4c9c3d8d))
* **ux:** auto-save, smooth level-up, better XP notification cards ([3fabfdd](https://github.com/diazjhozua/ragebait-kitchen/commit/3fabfdd807c2b2673e6a7a84d2bd15f5ef0a036a)), closes [hi#contrast](https://github.com/hi/issues/contrast)


### Performance Improvements

* **notifications:** prevent lag from stacking XP notifications ([1acb804](https://github.com/diazjhozua/ragebait-kitchen/commit/1acb804ca2202d3cdc64a5c667b90ef7fda5e743))
* **verdict:** replace laggy shake animation with smooth entrance ([b71e93d](https://github.com/diazjhozua/ragebait-kitchen/commit/b71e93dc8a570389be3d9715999274af8635ef86))

# [1.4.0](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.3.0...v1.4.0) (2026-03-28)


### Bug Fixes

* **ui:** clear XP notification fully above the nav header ([aa9723d](https://github.com/diazjhozua/ragebait-kitchen/commit/aa9723dd7c577f1bf5b9736ab2640faa47a169d0))


### Features

* **gamification:** add per-chef XP tracking and XP leaderboard tab ([e58056d](https://github.com/diazjhozua/ragebait-kitchen/commit/e58056d94419466e79edb0c7f90028918132e075))
* implement chef name selection and management ([d7f9999](https://github.com/diazjhozua/ragebait-kitchen/commit/d7f99991a17a3e171d39c362063f0043c56c2dff))
* **layout:** move verdict above grid, add live level badge near chef name ([fa61c9b](https://github.com/diazjhozua/ragebait-kitchen/commit/fa61c9bf158d5c9d55291a5006d7bf45964183b2))

# [1.3.0](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.2.0...v1.3.0) (2026-03-27)


### Features

* add navigation back to game from settings passcode gate ([cdabde1](https://github.com/diazjhozua/ragebait-kitchen/commit/cdabde10f90dfd13d674e827d1856019f89431d5))
* implement configuration storage and passcode protection ([c78d521](https://github.com/diazjhozua/ragebait-kitchen/commit/c78d5216a60c016b978daa65dc2695df6b611d99))
* implement settings page for AI configuration and security ([08b87f3](https://github.com/diazjhozua/ragebait-kitchen/commit/08b87f34beb713351379cd1c7c4552747187b46f))
* integrate app configuration with AI service and passcode logic ([0005c5c](https://github.com/diazjhozua/ragebait-kitchen/commit/0005c5c3633029f110f158c8755a33c663c528e7))
* integrate settings page into application navigation ([9d5f417](https://github.com/diazjhozua/ragebait-kitchen/commit/9d5f4173cf06fa80767ee87c641b7479a13d0a56))

# [1.2.0](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.1.0...v1.2.0) (2026-03-26)


### Bug Fixes

* prevent redundant judgment notifications on parent re-renders ([05c864b](https://github.com/diazjhozua/ragebait-kitchen/commit/05c864baf543aea623807258cc6736020a694a7b))


### Features

* implement relevance filtering for non-recipe submissions ([64cd074](https://github.com/diazjhozua/ragebait-kitchen/commit/64cd074052f6e96b49aa5d924895c71758f78a14))
* refine AI judge prompts with strict rubrics and personality biases ([989e2c3](https://github.com/diazjhozua/ragebait-kitchen/commit/989e2c3ded9fd5b5c940f1e7fa95edc246345ac8))
* upgrade to gpt-4o and adjust AI judge temperature ([1e6a4f5](https://github.com/diazjhozua/ragebait-kitchen/commit/1e6a4f5900629356b4b5a15b18c2a3104633e5a7))

# [1.1.0](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.0.1...v1.1.0) (2026-03-25)


### Features

* polish leaderboard UI and optimize sidebar layout ([dbf888a](https://github.com/diazjhozua/ragebait-kitchen/commit/dbf888ab69e748407d623d405fd4e4c5c3e1b7cf))

## [1.0.1](https://github.com/diazjhozua/ragebait-kitchen/compare/v1.0.0...v1.0.1) (2026-03-25)


### Bug Fixes

* configure router basename for subpath deployment ([4e3f417](https://github.com/diazjhozua/ragebait-kitchen/commit/4e3f417c66f258cf1de5464f051f74f67a8234ac))

# 1.0.0 (2026-03-25)


### Features

* add about page and polish user interface ([8958d12](https://github.com/diazjhozua/ragebait-kitchen/commit/8958d124f273ff49339914016d0c1b469af49838))
* add custom API endpoint support and flexible configuration ([5a31824](https://github.com/diazjhozua/ragebait-kitchen/commit/5a3182492282306b5caee298c95a7c7516e0ed45))
* implement automated deployment and finalize Hell's Kitchen branding ([2a9c245](https://github.com/diazjhozua/ragebait-kitchen/commit/2a9c245fcc8ca27804a849987b1f59bab855a937))
* implement game UI components and core gameplay loop ([cf72c77](https://github.com/diazjhozua/ragebait-kitchen/commit/cf72c778c776cc8db6e22b8224f92d1ae8230ad6))
* implement Hell's Kitchen theme and gamification type system ([885a8e2](https://github.com/diazjhozua/ragebait-kitchen/commit/885a8e27f5f14d536a7246443f2501b62d922bb2)), closes [hi#intensity](https://github.com/hi/issues/intensity)
* implement Hell's Kitchen visual theme and gamification UI components ([48cc745](https://github.com/diazjhozua/ragebait-kitchen/commit/48cc7458d40b85635cfd2e07c828121348984d1d)), closes [hi#intensity](https://github.com/hi/issues/intensity)
* implement local leaderboard and data persistence ([ca6537c](https://github.com/diazjhozua/ragebait-kitchen/commit/ca6537c5cc5e93468a21d4631f89330fc7213610))
* implement openai integration and recipe judging logic ([bed8bb7](https://github.com/diazjhozua/ragebait-kitchen/commit/bed8bb7254e023be044eaa1d0eeeb4124a7a1c00))
* implement player progression and achievement systems ([9eb2667](https://github.com/diazjhozua/ragebait-kitchen/commit/9eb2667af80034b88b547502e8be3dce4f4a0a3b))
* implement reactive animation system and immersive kitchen visuals ([05302b3](https://github.com/diazjhozua/ragebait-kitchen/commit/05302b3e0e9f9dd34e6931d789abf64033847e4f)), closes [hi#intensity](https://github.com/hi/issues/intensity)
* implement recipe similarity detection and score penalties ([8df0519](https://github.com/diazjhozua/ragebait-kitchen/commit/8df05197581006221df804903d586bd0277ef890))
* improve recipe submission flow and form reset mechanism ([665fc51](https://github.com/diazjhozua/ragebait-kitchen/commit/665fc518d91a94cacf21a45a7911ed18ae43ef91))
* initialize vite react typescript project with tailwind and routing ([c5b8031](https://github.com/diazjhozua/ragebait-kitchen/commit/c5b80316b25519e65c0b693b39e440501777293a))
* integrate gamification and player progression into the PlayPage ([a9755f6](https://github.com/diazjhozua/ragebait-kitchen/commit/a9755f6ea2627dfc337a5aee690d197742646866))
