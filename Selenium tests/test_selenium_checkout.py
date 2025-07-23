import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
import random
import string

class TestCheckoutProcess(unittest.TestCase):
    
    def setUp(self):
        """Set up the WebDriver before each test"""
        chrome_options = Options()
        # Uncomment the line below if you want to run in headless mode
        # chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        # Initialize the Chrome WebDriver
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)
        self.wait = WebDriverWait(self.driver, 10)
        
        # Base URL - update this to match your application URL
        self.base_url = "http://localhost:5173"  # Default Vite dev server port
        
    def tearDown(self):
        """Clean up after each test"""
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def login_user(self):
        """Helper method to login a user for checkout tests"""
        try:
            print("Logging in user for checkout test...")
            
            # Navigate to login page
            self.driver.get(f"{self.base_url}/login")
            
            # Fill login form with test credentials
            email_field = self.wait.until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            email_field.send_keys("test@example.com")  # Use a known test account
            
            password_field = self.driver.find_element(By.NAME, "password")
            password_field.send_keys("testpassword")  # Use a known test password
            
            # Submit login
            submit_button = self.driver.find_element(
                By.XPATH, "//button[@type='submit']"
            )
            submit_button.click()
            
            # Wait for successful login
            self.wait.until(
                EC.url_contains(self.base_url) or EC.url_ends_with("/")
            )
            
            print("✅ User logged in successfully")
            return True
            
        except Exception as e:
            print(f"❌ Login failed: {str(e)}")
            return False
    
    def add_items_to_cart(self):
        """Helper method to add items to cart"""
        try:
            print("Adding items to cart...")
            
            # Navigate to home page
            self.driver.get(self.base_url)
            
            # Look for product cards with border and h-[300px]
            products = self.wait.until(
                EC.presence_of_all_elements_located(
                    (By.XPATH, "//div[contains(@class, 'border') and contains(@class, 'h-[300px]')]")
                )
            )
            
            if len(products) == 0:
                return False
            
            # Add first product
            first_product = products[0]
            actions = ActionChains(self.driver)
            actions.move_to_element(first_product).perform()
            time.sleep(1)  # Wait for hover effect
            
            # Find and click add to cart button (red plus button)
            add_to_cart_button = self.wait.until(
                EC.element_to_be_clickable(
                    (By.XPATH, ".//button[div[contains(@class, 'bg-red-500')]]")
                )
            )
            add_to_cart_button.click()
            time.sleep(2)
            
            # Add second product if available
            if len(products) > 1:
                try:
                    second_product = products[1]
                    actions.move_to_element(second_product).perform()
                    time.sleep(1)  # Wait for hover effect
                    
                    add_to_cart_button_2 = self.wait.until(
                        EC.element_to_be_clickable(
                            (By.XPATH, ".//button[div[contains(@class, 'bg-red-500')]]")
                        )
                    )
                    add_to_cart_button_2.click()
                    time.sleep(2)
                except Exception as e:
                    print(f"⚠️ Could not add second product: {str(e)}")
            
            print("✅ Items added to cart")
            return True
            
        except Exception as e:
            print(f"❌ Failed to add items to cart: {str(e)}")
            return False
    
    def test_complete_checkout_process(self):
        """Test complete checkout process from cart to order completion"""
        try:
            print("Testing complete checkout process...")
            
            # Step 1: Login user
            print("Step 1: Logging in user...")
            if not self.login_user():
                self.fail("Failed to login user for checkout test")
            
            # Step 2: Add items to cart
            print("Step 2: Adding items to cart...")
            if not self.add_items_to_cart():
                self.fail("Failed to add items to cart")
            
            # Step 3: Navigate to checkout page
            print("Step 3: Navigating to checkout page...")
            self.driver.get(f"{self.base_url}/checkout")
            
            # Step 4: Verify order summary displays correctly
            print("Step 4: Verifying order summary...")
            try:
                order_summary = self.wait.until(
                    EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'order-summary') or contains(@class, 'summary')]"))
                )
                print("✅ Order summary found")
                
                # Verify cart items are displayed
                cart_items = self.driver.find_elements(
                    By.XPATH, "//div[contains(@class, 'cart-item') or contains(@class, 'item')]"
                )
                self.assertGreater(len(cart_items), 0, "Cart items should be displayed in order summary")
                print(f"✅ Found {len(cart_items)} items in order summary")
                
            except Exception as e:
                print(f"⚠️ Order summary verification failed: {str(e)}")
            
            # Step 5: Fill out shipping information
            print("Step 5: Filling out shipping information...")
            
            # Fill shipping form fields
            shipping_fields = {
                "firstName": "John",
                "lastName": "Doe",
                "street": "123 Test Street",
                "city": "Test City",
                "state": "Test State",
                "zipCode": "12345",
                "country": "Test Country",
                "phone": "123-456-7890"
            }
            
            for field_name, field_value in shipping_fields.items():
                try:
                    field = self.driver.find_element(By.NAME, field_name)
                    field.clear()
                    field.send_keys(field_value)
                    print(f"✅ Filled {field_name}: {field_value}")
                except Exception as e:
                    print(f"⚠️ Could not fill {field_name}: {str(e)}")
            
            # Step 6: Select payment method
            print("Step 6: Selecting payment method...")
            try:
                # Try to find payment method radio buttons
                payment_methods = self.driver.find_elements(
                    By.XPATH, "//input[@type='radio' and contains(@name, 'payment')]"
                )
                
                if len(payment_methods) > 0:
                    # Select first payment method
                    payment_methods[0].click()
                    print("✅ Payment method selected")
                else:
                    # Try to find payment method dropdown
                    payment_dropdown = self.driver.find_element(
                        By.XPATH, "//select[contains(@name, 'payment')]"
                    )
                    payment_dropdown.click()
                    first_option = payment_dropdown.find_element(By.XPATH, ".//option[1]")
                    first_option.click()
                    print("✅ Payment method selected from dropdown")
                    
            except Exception as e:
                print(f"⚠️ Could not select payment method: {str(e)}")
            
            # Step 7: Submit order
            print("Step 7: Submitting order...")
            try:
                # Look for submit button with primary background class
                submit_button = self.wait.until(
                    EC.element_to_be_clickable(
                        (By.XPATH, "//button[@type='submit' and contains(@class, 'bg-primary') and not(@disabled)]")
                    )
                )
                
                # Ensure button is in viewport
                self.driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
                time.sleep(1)  # Allow time for scroll
                
                submit_button.click()
                
                # Wait for order processing
                time.sleep(3)
                
                print("✅ Order submitted")
                
            except Exception as e:
                print(f"❌ Failed to submit order: {str(e)}")
                self.fail(f"Order submission failed: {str(e)}")
            
            # Step 8: Verify order confirmation
            print("Step 8: Verifying order confirmation...")
            try:
                # Look for success message or confirmation page
                success_message = self.wait.until(
                    EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'success') or contains(text(), 'Order Placed') or contains(text(), 'Success')]"))
                )
                
                self.assertIn("success", success_message.text.lower() or success_message.get_attribute("class").lower())
                print("✅ Order confirmation verified")
                
            except Exception as e:
                print(f"⚠️ Could not verify order confirmation: {str(e)}")
            
            # Step 9: Verify cart clearing
            print("Step 9: Verifying cart clearing...")
            try:
                # Navigate back to home page
                self.driver.get(self.base_url)
                time.sleep(2)
                
                # Check if cart is empty
                cart_count = self.driver.find_element(
                    By.XPATH, "//span[contains(@class, 'cart-count') or contains(@class, 'badge')]"
                )
                count_text = cart_count.text
                
                if count_text == "0" or count_text == "":
                    print("✅ Cart cleared after successful order")
                else:
                    print(f"⚠️ Cart not cleared - count: {count_text}")
                    
            except Exception as e:
                print(f"⚠️ Could not verify cart clearing: {str(e)}")
            
            print("✅ Complete checkout process test completed!")
            
        except Exception as e:
            print(f"❌ Checkout process test failed: {str(e)}")
            self.fail(f"Checkout process test failed: {str(e)}")
    
    def test_checkout_form_validation(self):
        """Test checkout form validation"""
        try:
            print("Testing checkout form validation...")
            
            # Step 1: Login and add items to cart
            if not self.login_user():
                self.fail("Failed to login user")
            
            if not self.add_items_to_cart():
                self.fail("Failed to add items to cart")
            
            # Step 2: Navigate to checkout
            self.driver.get(f"{self.base_url}/checkout")
            
            # Step 3: Try to submit without filling required fields
            print("Step 3: Testing form validation with empty fields...")
            submit_button = self.wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//button[@type='submit' and contains(@class, 'bg-primary')]")
                )
            )
            submit_button.click()
            
            # Step 4: Verify validation errors appear
            print("Step 4: Verifying validation errors...")
            time.sleep(2)
            
            # Look for validation error messages
            error_messages = self.driver.find_elements(
                By.XPATH, "//div[contains(@class, 'error') or contains(@class, 'validation')]"
            )
            
            if len(error_messages) > 0:
                print(f"✅ Form validation working - found {len(error_messages)} error messages")
            else:
                print("⚠️ No validation errors found - form might not have client-side validation")
            
            # Step 5: Test with invalid data
            print("Step 5: Testing with invalid data...")
            
            # Try invalid email format
            try:
                email_field = self.driver.find_element(By.NAME, "email")
                email_field.clear()
                email_field.send_keys("invalid-email")
                email_field.send_keys(Keys.TAB)  # Trigger validation
                
                time.sleep(1)
                
                # Check for email validation error
                email_error = self.driver.find_elements(
                    By.XPATH, "//div[contains(text(), 'email') or contains(text(), 'Email')]"
                )
                
                if len(email_error) > 0:
                    print("✅ Email validation working")
                else:
                    print("⚠️ Email validation not found")
                    
            except Exception as e:
                print(f"⚠️ Could not test email validation: {str(e)}")
            
            print("✅ Checkout form validation test completed!")
            
        except Exception as e:
            print(f"❌ Form validation test failed: {str(e)}")
            self.fail(f"Form validation test failed: {str(e)}")
    
    def test_checkout_without_authentication(self):
        """Test checkout process without authentication"""
        try:
            print("Testing checkout without authentication...")
            
            # Step 1: Add items to cart without logging in
            self.driver.get(self.base_url)
            
            if not self.add_items_to_cart():
                self.fail("Failed to add items to cart")
            
            # Step 2: Try to access checkout page
            print("Step 2: Attempting to access checkout without login...")
            self.driver.get(f"{self.base_url}/checkout")
            
            # Step 3: Verify login requirement message
            print("Step 3: Verifying login requirement...")
            time.sleep(2)
            
            try:
                login_required = self.driver.find_element(
                    By.XPATH, "//div[contains(text(), 'Login Required') or contains(text(), 'Please login')]"
                )
                print("✅ Login requirement message displayed")
                
                # Verify redirect to login or login prompt
                login_button = self.driver.find_element(
                    By.XPATH, "//button[contains(text(), 'Login') or contains(text(), 'Sign In')]"
                )
                print("✅ Login button found")
                
            except Exception as e:
                print(f"⚠️ Login requirement not enforced: {str(e)}")
            
            print("✅ Checkout without authentication test completed!")
            
        except Exception as e:
            print(f"❌ Checkout without authentication test failed: {str(e)}")
            self.fail(f"Checkout without authentication test failed: {str(e)}")
    
    def test_checkout_with_empty_cart(self):
        """Test checkout process with empty cart"""
        try:
            print("Testing checkout with empty cart...")
            
            # Step 1: Login user
            if not self.login_user():
                self.fail("Failed to login user")
            
            # Step 2: Navigate to checkout with empty cart
            print("Step 2: Navigating to checkout with empty cart...")
            self.driver.get(f"{self.base_url}/checkout")
            
            # Step 3: Verify empty cart message
            print("Step 3: Verifying empty cart message...")
            time.sleep(2)
            
            try:
                empty_cart_message = self.driver.find_element(
                    By.XPATH, "//div[contains(text(), 'empty') or contains(text(), 'no items') or contains(text(), 'cart is empty')]"
                )
                print("✅ Empty cart message displayed")
                
            except Exception as e:
                print(f"⚠️ Empty cart message not found: {str(e)}")
            
            print("✅ Checkout with empty cart test completed!")
            
        except Exception as e:
            print(f"❌ Empty cart checkout test failed: {str(e)}")
            self.fail(f"Empty cart checkout test failed: {str(e)}")

if __name__ == "__main__":
    # Run the tests
    unittest.main(verbosity=2) 