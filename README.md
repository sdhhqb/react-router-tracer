# react-router-tracer
work with react-router, trace and record route change and change direction.

This lib is used for improve mobile web apps usability.

Think about these situations:

* You enter web app at /index, and navigate to /pageA , then /pageB, then /pageA again. Generally your browser history will be /index, /pageA, /pageB, /pageA. Thus you will have to hit back btn 3 times on Android, or custom back btn in the page on IOS to navigate back to /index. 

* In a hybird app, you capture back btn hit event, in event handler you do a history go back business. When enter app at /index and navigate to /pageA, then /pageB. what will happen, when first hit refresh button, then hit back button.
