import { CourseWorkPage } from './app.po';

describe('course-work App', () => {
  let page: CourseWorkPage;

  beforeEach(() => {
    page = new CourseWorkPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
