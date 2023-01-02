// Note: sort `images` by `ordinal`.
export function compareImages(imageLeft, imageRight) {
  if (imageLeft.ordinal > imageRight.ordinal) {
    return 1;
  }
  if (imageLeft.ordinal < imageRight.ordinal) {
    return -1;
  }

  return imageLeft;
}

export function getSortedCarouselImages(images = []) {
  return [...images].sort(compareImages);
}
