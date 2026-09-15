/** Shared published/preview content projection; no browser or credential dependency. */
export const QUERY = `{
  "settings": *[_type=="siteSettings"][0]{phoneDisplay, phoneHref, email, orderEmail, facebook, instagram, ahaUrl, woltUrl, mainAddress, trustLine, ordersPaused, hidePersonalOccasions, hideCompanyOccasions, ordersPauseMessage, textOverrides[]{key,text}, partyOffer, orderExtras[]{"id": id.current, label, menuItem->{name,price}, image{asset,hotspot,crop}, step, max, kjorPrice, bulkAt}, images[]{slot, caption, image{asset,hotspot,crop}}},
  "hours": *[_type=="openingHours"][0]{mon, tue, wed, thu, fri, sat, sun, exceptions[]{date, open, close, closed}},
  "hero": *[_type=="heroSection"][0]{heroTitle, heroSub, heroLine, heroPhotoCaption},
  "story": *[_type=="storySection"][0]{statementQuote, statementWho, storyP1, storyP2},
  "menuItems": *[_type=="menuItem"]|order(order asc){category, name, price, tag, desc},
  "reviews": *[_type=="review"]|order(order asc){quote, who},
  "gallery": *[_type=="galleryImage"]|order(order asc){image{asset,hotspot,crop}, caption},
  "orderProducts": *[_type=="orderProduct" && active != false]|order(order asc){
    "id": id.current, name, blurb, basePrice, pricePerPerson, "sizeGroupId": sizeGroupId.current,
    "compositionGroupId": compositionGroupId.current, composition[]{"id": id.current, label},
    leadDays, noticeMode, inscription, image{asset,hotspot,crop},
    groups[]{"id": id.current, kind, label, help, required, max, layout,
      choices[]{"id": id.current, label, priceDelta, note, serves, price, quoteOnly, needsPhoto, freeText,
        adds, swap{"layerId": layerId.current, label}}}
  },
  "occasions": *[_type=="occasion"]|order(order asc){"id": id.current, label, audience, freeText, suggests},
  "pickupLocations": *[_type=="pickupLocation"]|order(order asc){"id": id.current, label}
}`
