import { get } from '../get';

export function getImagesData() {
  var result = get('../../data/imagesData.json');
  result.then(res => {
    return res.json();
  }).then(json => {
    return json;
  })
}
