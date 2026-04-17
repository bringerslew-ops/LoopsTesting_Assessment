const { test, expect } = require('@playwright/test');
const testData = require('./testData.json');

//automated login that is done before each test to ensure they're executed on a fresh page
test.beforeEach(async({ page }) => {
    await page.goto('https://animated-gingersnap-8cf7f2.netlify.app');

    //checks for the username and password testboxes which are then filled in
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password123');

    //check for the sign in button which is then clicked
    await page.getByRole('button', {name: /sign in/i}).click();

    /*checks for the 'Projects' text that is displayed on the main dashboard
    to ensure we are logged in*/
    await expect(page.locator('text=Projects')).toBeVisible();
});

//navigation function that navigates to the correct section of the page for the test
async function navigateSections(page, section){
    //checks for the section name and clicks the tab button
    await page.getByRole('button', {name: section}).click();

    //checks for the 'To-Do' to ensure we are looking at a kanban board
    await expect(page.locator('text=To Do')).toBeVisible();
}

//Primary function that executes the 6 tests by receiving each JSON object
for(const section of Object.keys(testData)){
    const tasks = testData[section];
    test.describe(`${section} tests`, () => {
        for(const {task, column, tags} of tasks){
            test(`${task} should be in ${column}`, async({page}) => {
                await navigateSections(page, section);

                //checks for the column that contains the task
                const columnContainer = page.locator(`text=${column}`).locator('..');

                //checks for the task contained in the column
                const taskCard = columnContainer.getByRole('heading', {name: task}).locator('..');

                //ensure that the task is present
                await expect(taskCard).toBeVisible();

                //checks for any tags present underneath the task
                for(const tag of tags){
                    await expect(taskCard.locator('span', {hasText: tag})).toBeVisible();
                }
            });
        }
    });
}