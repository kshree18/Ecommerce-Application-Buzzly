# Selenium Test Automation for Ecommerce Website

This directory contains comprehensive Selenium test scripts for automating the three main functional scenarios of the ecommerce website.

## Test Scenarios

### 1. User Authentication Flow (`test_selenium_authentication.py`)
- Complete user registration and login process
- Invalid credentials testing
- Remember me functionality
- Form validation testing

### 2. Product Browsing and Shopping Cart Management (`test_selenium_product_browsing.py`)
- Product browsing and category filtering
- Adding products to cart
- Cart item management (quantity adjustments, removal)
- Cart persistence across page refreshes

### 3. Complete Checkout Process (`test_selenium_checkout.py`)
- End-to-end purchase flow
- Form validation testing
- Authentication requirements
- Empty cart handling

## Prerequisites

### 1. Install Python Dependencies
```bash
pip install -r requirements_selenium.txt
```

### 2. Install Chrome WebDriver
The tests use Chrome WebDriver. You can install it in two ways:

**Option A: Using webdriver-manager (Recommended)**
```bash
pip install webdriver-manager
```

**Option B: Manual Installation**
1. Download ChromeDriver from: https://chromedriver.chromium.org/
2. Add it to your system PATH or place it in the same directory as the test files

### 3. Start the Application
Make sure your ecommerce application is running:
```bash
# Frontend (React/Vite)
npm run dev

# Backend (Node.js/Express)
cd backend
npm start
```

## Configuration

### Update Base URL
In each test file, update the `base_url` variable to match your application URL:

```python
self.base_url = "http://localhost:5173"  # Default Vite dev server port
```

### Test Credentials
Update the test credentials in the authentication tests:

```python
# In test_selenium_authentication.py and test_selenium_checkout.py
email_field.send_keys("test@example.com")  # Use your test account
password_field.send_keys("testpassword")   # Use your test password
```

## Running the Tests

### Run All Tests
```bash
# Run all authentication tests
python test_selenium_authentication.py

# Run all product browsing tests
python test_selenium_product_browsing.py

# Run all checkout tests
python test_selenium_checkout.py
```

### Run Individual Test Methods
```bash
# Run specific test method
python -m unittest test_selenium_authentication.TestAuthenticationFlow.test_user_registration_and_login
```

### Run with Verbose Output
```bash
python -m unittest test_selenium_authentication -v
```

## Test Structure

### Authentication Tests
- `test_user_registration_and_login()`: Complete registration and login flow
- `test_invalid_login_credentials()`: Test error handling for invalid credentials
- `test_remember_me_functionality()`: Test remember me checkbox

### Product Browsing Tests
- `test_product_browsing_and_filtering()`: Test category filtering
- `test_add_to_cart_functionality()`: Test adding products to cart
- `test_cart_management()`: Test cart item operations
- `test_cart_persistence()`: Test cart persistence across refreshes

### Checkout Tests
- `test_complete_checkout_process()`: End-to-end checkout flow
- `test_checkout_form_validation()`: Form validation testing
- `test_checkout_without_authentication()`: Authentication requirements
- `test_checkout_with_empty_cart()`: Empty cart handling

## Troubleshooting

### Common Issues

1. **ChromeDriver not found**
   ```bash
   # Install webdriver-manager and update the test files to use:
   from webdriver_manager.chrome import ChromeDriverManager
   from selenium.webdriver.chrome.service import Service
   
   service = Service(ChromeDriverManager().install())
   self.driver = webdriver.Chrome(service=service, options=chrome_options)
   ```

2. **Element not found errors**
   - Check if the application is running on the correct URL
   - Verify that the XPath selectors match your application's HTML structure
   - Update selectors based on your actual implementation

3. **Timing issues**
   - Increase the `implicitly_wait` value in the setUp method
   - Add more explicit waits using `WebDriverWait`

4. **Headless mode issues**
   - Uncomment the headless option in the setUp method:
   ```python
   chrome_options.add_argument("--headless")
   ```

### Debug Mode
To run tests in debug mode with visible browser:
```python
# In setUp method, comment out the headless option
# chrome_options.add_argument("--headless")
```

## Customization

### Adding New Tests
1. Create a new test method in the appropriate test class
2. Follow the existing pattern with try-catch blocks
3. Add descriptive print statements for debugging
4. Use explicit waits for better reliability

### Updating Selectors
If your application uses different HTML structure, update the XPath selectors:

```python
# Example: Update product selector
products = self.driver.find_elements(
    By.XPATH, "//div[contains(@class, 'your-product-class')]"
)
```

### Test Data Management
For better test data management, consider:
- Using environment variables for test credentials
- Creating test data factories
- Implementing test data cleanup

## Best Practices

1. **Use Explicit Waits**: Always use `WebDriverWait` instead of `time.sleep()`
2. **Handle Exceptions**: Wrap test logic in try-catch blocks
3. **Clean Up**: Ensure proper cleanup in `tearDown` method
4. **Descriptive Names**: Use clear, descriptive test method names
5. **Logging**: Add print statements for debugging and progress tracking

## Integration with CI/CD

To integrate these tests with your CI/CD pipeline:

1. **GitHub Actions Example**:
```yaml
name: Selenium Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        pip install -r requirements_selenium.txt
    - name: Install Chrome
      run: |
        sudo apt-get update
        sudo apt-get install -y google-chrome-stable
    - name: Run tests
      run: |
        python test_selenium_authentication.py
        python test_selenium_product_browsing.py
        python test_selenium_checkout.py
```

2. **Docker Example**:
```dockerfile
FROM python:3.9
RUN apt-get update && apt-get install -y google-chrome-stable
COPY requirements_selenium.txt .
RUN pip install -r requirements_selenium.txt
COPY . .
CMD ["python", "test_selenium_authentication.py"]
```

## Reporting

For better test reporting, consider using pytest with HTML reports:

```bash
pip install pytest-html
pytest test_selenium_authentication.py --html=report.html
```

This will generate an HTML report with test results, screenshots, and detailed information about test execution. 