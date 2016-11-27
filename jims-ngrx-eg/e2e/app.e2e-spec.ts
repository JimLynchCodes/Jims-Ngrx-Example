import { JimsNgrxEgPage } from './app.po';

describe('jims-ngrx-eg App', function() {
  let page: JimsNgrxEgPage;

  beforeEach(() => {
    page = new JimsNgrxEgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
