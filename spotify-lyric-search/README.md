# Spotify Lyric Search

## Project Overview

Spotify Lyric Search is a **machine learning / NLP project** that identifies the **most likely song title and artist** given a short snippet of song lyrics. The system uses **BM25 ranking algorithm** for text-based retrieval, a proven approach in information retrieval systems.

This project is designed to demonstrate:

* Text preprocessing and normalization
* BM25 (Best Matching 25) ranking algorithm
* Top-K evaluation methodology
* Information retrieval best practices

The implementation is suitable for academic submission and follows industry-standard NLP practices.

---

## Dataset

**Spotify Lyrics Dataset (50k+ songs)**

### Columns Used

| Column   | Description      |
| -------- | ---------------- |
| `artist` | Artist name      |
| `song`   | Song title       |
| `text`   | Full song lyrics |

The dataset is internally normalized to:

* `artist_name`
* `track_name`
* `lyrics`

> Note: The dataset contains **multiple songs with identical titles** (e.g., many songs titled *"Hello"* by different artists). This introduces real-world ambiguity, which the system explicitly handles.

---

## Methodology

### 1. Text Preprocessing

Implemented in `src/preprocess.py`:

* Lowercasing
* Removal of punctuation and special characters
* Tokenization
* Stop-word removal (NLTK)
* Lemmatization (WordNet Lemmatizer)

This step reduces noise and improves retrieval quality by normalizing the text.

---

### 2. Ranking Algorithm

* **Algorithm**: BM25 (Best Matching 25)
* **Implementation**: BM25Okapi from `rank_bm25` library
* **Type**: Probabilistic information retrieval

BM25 is a ranking function used by search engines to estimate the relevance of documents to a given search query. It considers:
- Term frequency (how often words appear)
- Inverse document frequency (how rare/common words are)
- Document length normalization

Each song's lyrics are tokenized and indexed using BM25.

---

### 3. Search Process

* **Approach**: Top-K retrieval using BM25 scoring

Given a lyric snippet:

1. The snippet is preprocessed and tokenized
2. BM25 scores are calculated for all songs in the corpus
3. Songs are ranked by relevance score
4. The top K most relevant songs are returned

---

### 4. Future Enhancement: Artist-Aware Re-ranking

When multiple songs share the same title or similar lyrics, an optional **artist hint** can be provided. Results can then be re-ranked to prioritize the matching artist.

This reflects real-world search behavior (e.g., Spotify or Google Search).

---

## Project Structure

```
spotify-lyric-search/
│
├── data/
│   └── spotify_lyrics.csv
│
├── notebooks/
│   └── lyric_search.ipynb
│
├── src/
│   ├── preprocess.py
│   ├── model.py          # (Note: Embeddings generated but not used in current search)
│   └── search.py         # BM25-based search implementation
│
├── results/
│   └── output.png
│
├── requirements.txt
└── README.md
```

---

## Installation

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Recommended environment:

* Python 3.10+
* Required libraries: pandas, numpy, nltk, rank_bm25, scikit-learn

---

## Usage

Open and run the notebook:

```bash
jupyter notebook notebooks/lyric_search.ipynb
```

Example query:

```python
search_engine.search("hello from the other side I must have called a thousand times", top_k=5)
```

Output:

* Top-K most relevant songs based on BM25 scores
* Song title, artist name, relevance score

---

## Performance Evaluation

### Evaluation Strategy

Because this is an **information retrieval task**, performance is measured using **Top-K accuracy**, not strict Top-1 classification.

* **Top-1 Accuracy**: Correct song ranked first
* **Top-3 Accuracy**: Correct song appears in top 3
* **Top-5 Accuracy**: Correct song appears in top 5

This is standard practice for search and recommendation systems.

---

### Observed Performance (Quantitative Results)

The model was evaluated on **100 randomly sampled songs** from the dataset using lyric snippets derived directly from the ground-truth lyrics.

| Metric         | Score   |
| -------------- | ------- |
| Top-1 Accuracy | **90%** |
| Top-3 Accuracy | **96%** |
| Top-5 Accuracy | **97%** |

A visual summary of these results is shown below:

![Accuracy Report](./results/output.png)

**Interpretation:**

* Top-1 accuracy of 90% demonstrates strong retrieval capability
* Top-3 and Top-5 scores show excellent ranking quality
* Results align with industry expectations for BM25-based retrieval systems
* Performance improves with longer lyric input

---

## Known Limitations

* The model can only retrieve songs **present in the dataset**
* Very short lyric snippets (1-3 words) reduce matching accuracy
* Multiple songs with identical titles introduce ambiguity
* BM25 is keyword-based and doesn't capture semantic similarity

These limitations are inherent to keyword-based retrieval systems and are not implementation errors.


---

## Technologies Used

* Python
* pandas - Data manipulation
* NLTK - Text preprocessing
* rank_bm25 - BM25 ranking algorithm
* scikit-learn - Machine learning utilities
* PyTorch - Deep learning framework

---

## Author

**Rahul Ghosh**  
B.Tech CSE (Data Science) 
Node.js Developer / Full Stack Developer

* GitHub: [https://github.com/Rahul17903](https://github.com/Rahul17903)
* Portfolio: [https://rahulghosh.me](https://rahulghosh.me)

---

## Conclusion

This project successfully demonstrates a **keyword-based lyric search system** using the BM25 ranking algorithm. By combining text preprocessing with BM25 scoring and Top-K evaluation, the system achieves strong retrieval performance.

The quantitative results (Top-1: 90%, Top-3: 96%, Top-5: 97%) validate that the model retrieves the correct song reliably, even with short lyric snippets. The BM25 approach provides a solid foundation for scalable lyric search and can be enhanced with semantic embeddings for future improvements.

Overall, the project provides a strong academic and practical foundation for text-based information retrieval applications.