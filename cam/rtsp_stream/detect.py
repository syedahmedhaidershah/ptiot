import cv2
import time
from flask import Flask
app = Flask(__name__)
import json

fullBodyCascade = cv2.CascadeClassifier("./cascades/full_body.xml")
faceCascade = cv2.CascadeClassifier("./cascades/front_face3.xml")
lowerBodyCascade = cv2.CascadeClassifier("./cascades/lowerbody.xml")
upperBodyCascade = cv2.CascadeClassifier("./cascades/upperbody.xml")


@app.route('/')
def returnFaces():
	imagePath = "./raw/1.jpg"
	foundfull = 0
	foundface = 0
	foundlower = 0
	foundupper = 0
	image = cv2.imread(imagePath)
	if(image is not None):
		gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

		foundfull = fullBodyCascade.detectMultiScale(
			gray,
			scaleFactor=1.1,
			minNeighbors=4,
			minSize=(30, 30),
			flags=cv2.CASCADE_SCALE_IMAGE
		)
		foundface = faceCascade.detectMultiScale(
			gray,
			scaleFactor=1.1,
			minNeighbors=5,
			minSize=(30, 30),
			flags=cv2.CASCADE_SCALE_IMAGE
		)
		foundlower = lowerBodyCascade.detectMultiScale(
			gray,
			scaleFactor=1.1,
			minNeighbors=4,
			minSize=(30, 30),
			flags=cv2.CASCADE_SCALE_IMAGE
		)
		foundupper = upperBodyCascade.detectMultiScale(
			gray,
			scaleFactor=1.1,
			minNeighbors=5,
			minSize=(30, 30),
			flags=cv2.CASCADE_SCALE_IMAGE
		)

		# Draw a rectangle around the found
		# for (x, y, w, h) in found:
		#	 cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)

		# cv2.imshow("found found", image)
		return json.dumps({'face': len(foundface), 'full': len(foundfull), 'lower': len(foundlower), 'upper': len(foundupper)})
	else:
		print(json.dumps())


if __name__ == '__main__':
	   app.run()
