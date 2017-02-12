import { CollagePage } from './app.po';

describe('collage App', function() {
  let page: CollagePage;

  beforeEach(() => {
    page = new CollagePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
