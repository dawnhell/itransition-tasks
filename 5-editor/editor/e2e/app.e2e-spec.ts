import { EditorPage } from './app.po';

describe('editor App', function() {
  let page: EditorPage;

  beforeEach(() => {
    page = new EditorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
