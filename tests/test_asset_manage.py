import unittest
from unittest.mock import patch
from AssetManagement import AssetManagement

class TestAssetManagement(unittest.TestCase):

    @patch("AssetManagement.DatabaseHandler")
    @patch("AssetManagement.Logger")
    def setUp(self, MockLogger, MockDBHandler):
        self.mock_db = MockDBHandler.return_value
        self.mock_logger = MockLogger.return_value
        self.asset_manager = AssetManagement()

    def test_get_assets_returns_expected_data(self):
        mock_email = "user@example.com"
        mock_assets = [
            ("Laptop", 1200, "user@example.com"),
            ("Phone", 800, "user@example.com")
        ]
        self.mock_db.fetch_row.return_value = mock_assets

        result = self.asset_manager.get_assets(mock_email)

        self.mock_db.fetch_row.assert_called_once_with((mock_email,), "assets", "owner_email")
        self.assertEqual(result, mock_assets)

if __name__ == "__main__":
    unittest.main()
