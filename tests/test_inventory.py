import unittest
from unittest.mock import MagicMock, patch
from InventoryManagement import InventoryManagement

class TestInventoryManagement(unittest.TestCase):

    @patch("InventoryManagement.DatabaseHandler")
    @patch("InventoryManagement.Logger")
    def setUp(self, MockLogger, MockDBHandler):
        # Mocks
        self.mock_db = MockDBHandler.return_value
        self.mock_logger = MockLogger.return_value

        # InventoryManager instance
        self.inv = InventoryManagement()

    def test_get_inventory_calls_fetch_table(self):
        self.inv.get_inventory()
        self.mock_db.fetch_table.assert_called_once_with("inventory")

    def test_order_existing_item_updates_quantity(self):
        # Mock an existing item with quantity at index 3
        self.mock_db.fetch.return_value = [("Apples", "Fruit", 2.99, 10)]

        self.inv.order_inventory("Apples", 5)

        self.mock_db.fetch.assert_called_with(("Apples",), "inventory", "item_name")
        self.mock_db.update.assert_called_once_with(15, "Apples", "inventory", "quantity", "item_name")

    def test_order_new_item_inserts_into_inventory(self):
        # Mock no existing item found
        self.mock_db.fetch.return_value = []

        self.inv.order_inventory("Bananas", 20)

        self.mock_db.fetch.assert_called_with(("Bananas",), "inventory", "item_name")
        self.mock_db.insert.assert_called_once_with(("Bananas", 20), "inventory")

if __name__ == "__main__":
    unittest.main()
