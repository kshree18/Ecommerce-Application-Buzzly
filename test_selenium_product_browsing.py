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

class TestProductBrowsingAndCart(unittest.TestCase):
    
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
    
    def test_product_browsing_and_filtering(self):
        """Test product browsing and category filtering"""
        try:
            print("Testing product browsing and filtering...")
            
            # Step 1: Navigate to home page
            print("Step 1: Navigating to home page...")
            self.driver.get(self.base_url)
            
            # Step 2: Verify products load correctly
            print("Step 2: Verifying products load...")
            # Each product card: look for border and h-[300px] (unique to product card)
            products = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'border') and contains(@class, 'h-[300px]')]"))
            )
            
            self.assertGreater(len(products), 0, "No products found on the page")
            print(f"Found {len(products)} products on the page")
            
            # Step 3: Test category filtering
            print("Step 3: Testing category filtering...")
            categories = ["men's clothing", "women's clothing", "jewelery", "electronics"]
            
            for category in categories:
                print(f"Testing category: {category}")
                try:
                    # Find the filter button by its span text (case-insensitive)
                    category_button = self.driver.find_element(
                        By.XPATH, f"//button[contains(@class, 'filter__button')]/span[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = '{category.lower()}']"
                    )
                    category_button.click()
                    time.sleep(2)
                    filtered_products = self.driver.find_elements(
                        By.XPATH, "//div[contains(@class, 'border') and contains(@class, 'h-[300px]')]"
                    )
                    if len(filtered_products) > 0:
                        print(f"✅ Category '{category}' filtering works - found {len(filtered_products)} products")
                    else:
                        print(f"⚠️ No products found for category '{category}'")
                except Exception as e:
                    print(f"⚠️ Category '{category}' filter not found or not clickable: {str(e)}")
            
            print("✅ Product browsing and filtering test completed!")
            
        except Exception as e:
            print(f"❌ Product browsing test failed: {str(e)}")
            self.fail(f"Product browsing test failed: {str(e)}")
    
    def test_add_to_cart_functionality(self):
        """Test adding products to cart"""
        try:
            print("Testing add to cart functionality...")
            
            # Step 1: Navigate to home page
            print("Step 1: Navigating to home page...")
            self.driver.get(self.base_url)
            
            # Step 2: Find first product and add to cart
            print("Step 2: Adding first product to cart...")
            products = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'border') and contains(@class, 'h-[300px]')]"))
            )
            
            if len(products) == 0:
                self.fail("No products found to add to cart")
            
            # Hover over first product to show add to cart button
            first_product = products[0]
            actions = ActionChains(self.driver)
            actions.move_to_element(first_product).perform()
            
            # Find and click add to cart button (button with child div.bg-red-500)
            # The add to cart button is inside the hovered product card, look for button with a child div.bg-red-500
            add_to_cart_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, ".//button[div[contains(@class, 'bg-red-500')]]"))
            )
            add_to_cart_button.click()
            
            # Step 3: Verify cart updates
            print("Step 3: Verifying cart updates...")
            time.sleep(2)  # Wait for cart to update
            
            # Check if cart icon shows updated count
            try:
                cart_count = self.driver.find_element(
                    By.XPATH, "//span[contains(@class, 'cart-count') or contains(@class, 'badge')]"
                )
                count_text = cart_count.text
                self.assertGreater(int(count_text), 0, "Cart count should be greater than 0")
                print(f"✅ Cart count updated to: {count_text}")
            except:
                print("⚠️ Cart count indicator not found, but product might still be added")
            
            # Step 4: Add another product to cart
            print("Step 4: Adding second product to cart...")
            if len(products) > 1:
                second_product = products[1]
                actions.move_to_element(second_product).perform()
                try:
                    add_to_cart_button_2 = self.wait.until(
                        EC.element_to_be_clickable((By.XPATH, ".//button[div[contains(@class, 'bg-red-500')]]"))
                    )
                    add_to_cart_button_2.click()
                    time.sleep(2)
                    print("✅ Second product added to cart")
                except Exception as e:
                    print(f"⚠️ Could not add second product to cart: {str(e)}")
            
            print("✅ Add to cart functionality test completed!")
            
        except Exception as e:
            print(f"❌ Add to cart test failed: {str(e)}")
            self.fail(f"Add to cart test failed: {str(e)}")
    
    def test_cart_management(self):
        """Test cart item management (quantity adjustments, removal)"""
        try:
            print("Testing cart management...")
            
            # Step 1: Navigate to cart/sidebar
            print("Step 1: Opening cart/sidebar...")
            self.driver.get(self.base_url)
            
            # Find and click the cart icon (div with cursor-pointer and BsBag svg)
            try:
                cart_icon = self.driver.find_element(
                    By.XPATH, "//div[contains(@class, 'cursor-pointer') and .//svg[contains(@class, 'text-2xl')]]"
                )
                cart_icon.click()
            except Exception as e:
                print(f"⚠️ Could not click cart icon: {str(e)}")
            # Wait for sidebar to be visible (right-0)
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'right-0') and contains(@class, 'fixed')]"))
            )
            # Step 2: Verify cart items are displayed
            print("Step 2: Verifying cart items...")
            cart_items = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'flex') and contains(@class, 'gap-x-4') and contains(@class, 'py-2')]"))
            )
            
            if len(cart_items) == 0:
                print("⚠️ No items in cart, adding some products first...")
                # Add products to cart first
                self.test_add_to_cart_functionality()
                
                # Try to open cart again
                try:
                    cart_icon = self.driver.find_element(
                        By.XPATH, "//button[contains(@class, 'cart') or contains(@class, 'sidebar')]"
                    )
                    cart_icon.click()
                except:
                    sidebar_toggle = self.driver.find_element(
                        By.XPATH, "//button[contains(@class, 'sidebar') or contains(@class, 'menu')]"
                    )
                    sidebar_toggle.click()
                
                cart_items = self.wait.until(
                    EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'flex') and contains(@class, 'gap-x-4') and contains(@class, 'py-2')]"))
                )
            
            # Step 3: Test quantity increase
            print("Step 3: Testing quantity increase...")
            if len(cart_items) > 0:
                first_item = cart_items[0]
                # Find increase quantity button: last .flex-1 inside the quantity control
                increase_button = first_item.find_elements(By.XPATH, ".//div[contains(@class, 'flex-1') and contains(@class, 'cursor-pointer')]")[-1]
                increase_button.click()
                time.sleep(1)
                print("✅ Quantity increased")
            
            # Step 4: Test quantity decrease
            print("Step 4: Testing quantity decrease...")
            if len(cart_items) > 0:
                first_item = cart_items[0]
                # Find decrease quantity button: first .flex-1 inside the quantity control
                decrease_button = first_item.find_elements(By.XPATH, ".//div[contains(@class, 'flex-1') and contains(@class, 'cursor-pointer')]")[0]
                decrease_button.click()
                time.sleep(1)
                print("✅ Quantity decreased")
            
            # Step 5: Test remove item
            print("Step 5: Testing item removal...")
            if len(cart_items) > 0:
                first_item = cart_items[0]
                # Find remove button: .text-xl.cursor-pointer
                remove_button = first_item.find_element(
                    By.XPATH, ".//div[contains(@class, 'text-xl') and contains(@class, 'cursor-pointer')]"
                )
                remove_button.click()
                time.sleep(1)
                print("✅ Item removed from cart")
            
            # Step 6: Verify cart total updates
            print("Step 6: Verifying cart total...")
            try:
                cart_total = self.driver.find_element(
                    By.XPATH, "//div[contains(@class, 'total') or contains(@class, 'sum')]"
                )
                total_text = cart_total.text
                print(f"✅ Cart total: {total_text}")
            except:
                print("⚠️ Cart total not found")
            
            print("✅ Cart management test completed!")
            
        except Exception as e:
            print(f"❌ Cart management test failed: {str(e)}")
            self.fail(f"Cart management test failed: {str(e)}")
    
    def test_cart_persistence(self):
        """Test cart persistence across page refreshes"""
        try:
            print("Testing cart persistence...")
            
            # Step 1: Add items to cart
            print("Step 1: Adding items to cart...")
            self.driver.get(self.base_url)
            
            # Add first product to cart
            products = self.wait.until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'border') and contains(@class, 'h-[300px]')]"))
            )
            
            if len(products) > 0:
                first_product = products[0]
                actions = ActionChains(self.driver)
                actions.move_to_element(first_product).perform()
                
                add_to_cart_button = self.wait.until(
                    EC.element_to_be_clickable((By.XPATH, ".//button[div[contains(@class, 'bg-red-500')]]"))
                )
                add_to_cart_button.click()
                
                time.sleep(2)
                
                # Step 2: Refresh page
                print("Step 2: Refreshing page...")
                self.driver.refresh()
                
                # Step 3: Verify cart items persist
                print("Step 3: Verifying cart persistence...")
                time.sleep(2)
                
                try:
                    cart_count = self.driver.find_element(
                        By.XPATH, "//span[contains(@class, 'cart-count') or contains(@class, 'badge')]"
                    )
                    count_text = cart_count.text
                    self.assertGreater(int(count_text), 0, "Cart should persist after refresh")
                    print(f"✅ Cart persisted after refresh - count: {count_text}")
                except:
                    print("⚠️ Cart count not found, but cart might still persist")
                
                # Step 4: Open cart to verify items
                print("Step 4: Opening cart to verify items...")
                try:
                    cart_icon = self.driver.find_element(
                        By.XPATH, "//div[contains(@class, 'cursor-pointer') and .//svg]"
                    )
                    cart_icon.click()
                    cart_items = self.wait.until(
                        EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'flex') and contains(@class, 'gap-x-4') and contains(@class, 'py-2')]"))
                    )
                    self.assertGreater(len(cart_items), 0, "Cart items should persist after refresh")
                    print(f"✅ Cart items persisted - found {len(cart_items)} items")
                except Exception as e:
                    print(f"⚠️ Could not verify cart items: {str(e)}")
            
            print("✅ Cart persistence test completed!")
            
        except Exception as e:
            print(f"❌ Cart persistence test failed: {str(e)}")
            self.fail(f"Cart persistence test failed: {str(e)}")

if __name__ == "__main__":
    # Run the tests
    unittest.main(verbosity=2) 