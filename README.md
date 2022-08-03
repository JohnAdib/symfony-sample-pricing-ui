# Symfony Sample Pricing API UI

This user interface is designed as an example to show API capabilities. According to the selected filters, the data is received from the server and displayed on this page.

- At the beginning, I decided to use react for this page, but I changed my mind and decided to use pure js to show off the ability of javascript!
- For CSS, I used tailwind css, which is very light and functional, and I think it has a bright future.

## Notes

- The list of filters is received from the server and can be completely customized.
- By changing the filters, the request is sent to the server and the new data is received and displayed.
- The design is responsive and tried to be mobile friendly. For sharing on social networks, special tags are used and appropriate description and image are placed

## Lighthouse Score 100 out of 100

![Lighthouse Score](public/img/lighthouse.jpg?raw=true "Lighthouse Score")

### Frontend Checklist

- [x] choose layout of page
- [x] add header
- [x] add range slider
- [x] add radio
- [x] add checkbox
- [x] add dropdown
- [x] add order by
- [x] design of each server
- [x] responsive design
- [x] load init data
- [x] design empty state
- [x] design filter without result state
- [x] design loading state
- [x] fetch servers data from API
- [x] apply filters and get updated data
- [x] get list of filters from API
- [x] don't send request if user play with filters
- [x] cancel last request if user changes filters
- [x] add link to API page
- [x] add link to MrAdib.com
- [x] get Lighthouse 100 score
