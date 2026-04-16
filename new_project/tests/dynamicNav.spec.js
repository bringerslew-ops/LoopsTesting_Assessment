const { test, expect } = require('@playwright/test');
const testData = require('./testData.json');

test.beforeEach(async({ page }) => {
    await page.goto('https://animated-gingersnap-8cf7f2.netlify.app');

    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password123');

    await page.getByRole('button', {name: /sign in/i}).click();

    await expect(page.locator('text=Projects')).toBeVisible();
});

async function navigateSections(page, section){
    await page.getByRole('button', {name: section}).click();

    await expect(page.locator('text=To Do')).toBeVisible();
}

for(const section of Object.keys(testData)){
    const tasks = testData[section];
    test.describe(`${section} tests`, () => {
        for(const {task, column, tags} of tasks){
            test(`${task} should be in ${column}`, async({page}) => {
                await navigateSections(page, section);

                const columnContainer = page.locator(`text=${column}`).locator('..');

                const taskCard = columnContainer.getByRole('heading', {name: task}).locator('..');

                await expect(taskCard).toBeVisible();

                for(const tag of tags){
                    await expect(taskCard.locator('span', {hasText: tag})).toBeVisible();
                }
            });
        }
    });
}