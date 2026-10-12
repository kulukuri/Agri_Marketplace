import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import sys

# The exact folder names from your dataset (alphabetical order usually)
CLASS_NAMES = ['damaged', 'dried', 'old', 'ripe', 'unripe']

def predict_quality(img_path):
    print(f"Loading model and analyzing: {img_path}...")
    model = tf.keras.models.load_model("tomato_quality_model.h5")
    
    # Load and format the image for MobileNetV2
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Create a batch of 1
    
    # MobileNetV2 requires inputs between -1 and 1
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    
    # Make prediction
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    
    predicted_class = CLASS_NAMES[np.argmax(score)]
    confidence = 100 * np.max(score)
    
    print("\n" + "="*40)
    print(f"🍅 AI Quality Grading Result:")
    print(f"Classification: {predicted_class.upper()}")
    print(f"Confidence:     {confidence:.2f}%")
    print("="*40 + "\n")

if __name__ == "__main__":
    # Test it with a random image from your computer
    # Run: python test_image.py path/to/tomato.jpg
    if len(sys.argv) > 1:
        predict_quality(sys.argv[1])
    else:
        print("Please provide an image path. Example: python test_image.py test.jpg")