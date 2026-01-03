import numpy as np
from rank_bm25 import BM25Okapi
from preprocess import preprocess_text

class LyricSearchEngine:
    def __init__(self, df):
       
        self.df = df
        
        # 1. Prepare the corpus for BM25
        # BM25 requires a list of lists of tokens (words)
        # We apply preprocessing and then split the string into tokens
        self.corpus_tokens = [
            preprocess_text(text).split() for text in self.df['lyrics'].tolist()
        ]
        
        # 2. Initialize and fit the BM25 model
        self.bm25 = BM25Okapi(self.corpus_tokens)

    def search(self, lyric_snippet: str, top_k: int = 5):
       
        # 1. Preprocess and tokenize user input
        clean_snippet = preprocess_text(lyric_snippet)
        tokenized_query = clean_snippet.split()

        # 2. Get scores from BM25
        scores = self.bm25.get_scores(tokenized_query)

        # 3. Get top results
        top_indices = np.argsort(scores)[-top_k:][::-1]

        candidates = self.df.iloc[top_indices].copy()
        candidates["score"] = scores[top_indices]

        return candidates[["track_name", "artist_name", "score"]]