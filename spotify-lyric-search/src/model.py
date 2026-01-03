import pandas as pd
from sentence_transformers import SentenceTransformer
from preprocess import preprocess_text

class LyricEmbeddingModel:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.df = None
        self.embeddings = None

    def load_dataset(self, csv_path: str):
        
        #Load dataset and normalize column names
        self.df = pd.read_csv(csv_path)

        # Required columns in your dataset
        required_cols = {"artist", "song", "text"}
        if not required_cols.issubset(self.df.columns):
            raise ValueError("Dataset must contain artist, song, text columns")

        # Normalize column names for internal use
        self.df = self.df.rename(columns={
            "artist": "artist_name",
            "song": "track_name",
            "text": "lyrics"
        })

        self.df["clean_lyrics"] = self.df["lyrics"].apply(preprocess_text)

    def generate_embeddings(self):
        
        #Generate sentence embeddings
        if self.df is None:
            raise RuntimeError("Dataset not loaded")

        self.embeddings = self.model.encode(
            self.df["clean_lyrics"].tolist(),
            show_progress_bar=True
        )

    def get_data(self):
        return self.df, self.embeddings, self.model
